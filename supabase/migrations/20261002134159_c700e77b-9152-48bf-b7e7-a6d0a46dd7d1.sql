create type public.app_role as enum ('admin', 'aluno');
create type public.curso_status as enum ('rascunho', 'publicado', 'arquivado');

-- Perfis
create table public.profiles (
  id uuid primary key,
  nome text not null default '',
  email text not null default '',
  cpf text,
  telefone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

-- Papéis
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Ver o próprio perfil" on public.profiles for select to authenticated
  using (auth.uid() = id or public.has_role(auth.uid(), 'admin'));
create policy "Editar o próprio perfil" on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);
create policy "Ver os próprios papéis" on public.user_roles for select to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

-- Novo usuário: cria perfil e papel (primeiro usuário vira administrador)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nome, email, cpf, telefone)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'nome', new.raw_user_meta_data->>'full_name', ''),
          coalesce(new.email, ''),
          new.raw_user_meta_data->>'cpf',
          new.raw_user_meta_data->>'telefone');
  insert into public.user_roles (user_id, role) values (new.id, 'aluno');
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Cursos
create table public.cursos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  resumo text not null default '',
  descricao text not null default '',
  objetivo text not null default '',
  publico text not null default '',
  categoria text not null default 'Geral',
  instrutor text not null default '',
  carga_horaria integer not null default 0,
  preco numeric(10,2) not null default 0,
  imagem_url text,
  materiais text[] not null default '{}',
  nota_minima integer not null default 70,
  nota numeric(2,1) not null default 5.0,
  destaque boolean not null default false,
  status curso_status not null default 'rascunho',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.cursos to anon;
grant select, insert, update, delete on public.cursos to authenticated;
grant all on public.cursos to service_role;
alter table public.cursos enable row level security;
create policy "Publicados são públicos" on public.cursos for select to anon, authenticated
  using (status = 'publicado');
create policy "Admin vê todos" on public.cursos for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admin cria" on public.cursos for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin edita" on public.cursos for update to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin exclui" on public.cursos for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create trigger cursos_touch before update on public.cursos
  for each row execute function public.touch_updated_at();

-- Módulos
create table public.modulos (
  id uuid primary key default gen_random_uuid(),
  curso_id uuid not null references public.cursos(id) on delete cascade,
  titulo text not null,
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);
create index on public.modulos (curso_id, ordem);
grant select on public.modulos to anon;
grant select, insert, update, delete on public.modulos to authenticated;
grant all on public.modulos to service_role;
alter table public.modulos enable row level security;
create policy "Módulos de curso publicado" on public.modulos for select to anon, authenticated
  using (exists (select 1 from public.cursos c where c.id = curso_id and c.status = 'publicado'));
create policy "Admin gerencia módulos" on public.modulos for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Aulas (só título/ordem nesta etapa; vídeo e apostila na etapa 2)
create table public.aulas (
  id uuid primary key default gen_random_uuid(),
  modulo_id uuid not null references public.modulos(id) on delete cascade,
  titulo text not null,
  descricao text not null default '',
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);
create index on public.aulas (modulo_id, ordem);
grant select on public.aulas to anon;
grant select, insert, update, delete on public.aulas to authenticated;
grant all on public.aulas to service_role;
alter table public.aulas enable row level security;
create policy "Aulas de curso publicado" on public.aulas for select to anon, authenticated
  using (exists (select 1 from public.modulos m join public.cursos c on c.id = m.curso_id
                 where m.id = modulo_id and c.status = 'publicado'));
create policy "Admin gerencia aulas" on public.aulas for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Dados iniciais (os 4 cursos de exemplo)
insert into public.cursos (slug, titulo, resumo, descricao, objetivo, publico, categoria, instrutor, carga_horaria, preco, materiais, nota, destaque, status) values
('gestao-financeira','Gestão Financeira para Pequenos Negócios','Organize caixa, precificação e lucro do seu negócio com método.','Um curso prático de finanças aplicadas à realidade de micro e pequenas empresas brasileiras, do controle de caixa à formação de preço de venda.','Capacitar o aluno a controlar o fluxo de caixa, precificar corretamente e interpretar os resultados do próprio negócio.','Empreendedores, autônomos e gestores de pequenas empresas.','Negócios','Profa. Marina Duarte',40,0,'{"Apostila em PDF","Planilha de fluxo de caixa","Modelo de precificação"}',4.8,true,'publicado'),
('analise-de-dados','Análise de Dados com Python','Da coleta à visualização: análise de dados aplicada ao mercado.','Trilha completa de análise de dados com Python, pandas e visualização, com projetos baseados em bases reais do mercado brasileiro.','Formar analistas capazes de tratar, analisar e apresentar dados para apoiar decisões de negócio.','Profissionais de qualquer área que queiram atuar com dados.','Tecnologia','Profa. Camila Rocha',48,297,'{"Apostila em PDF","Notebooks do curso","Bases de dados para prática"}',4.9,true,'publicado'),
('gestao-de-projetos','Gestão de Projetos Ágeis','Entregue projetos no prazo com Scrum, Kanban e métricas.','Curso voltado à condução prática de projetos ágeis, com cerimônias, artefatos e indicadores de desempenho de time.','Preparar o aluno para conduzir times e projetos com práticas ágeis consolidadas.','Líderes de time, analistas e profissionais de projetos.','Negócios','Prof. Diego Ferraz',36,189,'{"Apostila em PDF","Templates de backlog","Checklist de cerimônias"}',4.7,false,'publicado'),
('comunicacao-corporativa','Comunicação Corporativa','Apresentações, e-mails e reuniões que geram resultado.','Desenvolva clareza, estrutura e presença na comunicação profissional, do e-mail do dia a dia à apresentação para a diretoria.','Aprimorar a comunicação escrita e falada em contextos corporativos.','Profissionais de todas as áreas e níveis.','Desenvolvimento profissional','Profa. Helena Prado',16,0,'{"Apostila em PDF","Modelos de apresentação"}',4.6,false,'publicado');

do $$
declare
  dados jsonb := '{
    "gestao-financeira": [["Fundamentos financeiros",["Linguagem financeira","Regime de caixa x competência","Separando pessoa física e jurídica"]],["Fluxo de caixa",["Montando o caixa diário","Projeção de 90 dias","Capital de giro"]],["Precificação",["Custos fixos e variáveis","Margem de contribuição","Formação do preço de venda"]],["Resultados e decisões",["DRE simplificada","Ponto de equilíbrio","Plano de ação"]]],
    "analise-de-dados": [["Python essencial",["Ambiente e primeiros passos","Estruturas de dados","Funções e boas práticas"]],["Tratamento de dados",["Leitura de arquivos","Limpeza com pandas","Junções e agregações"]],["Análise exploratória",["Estatística descritiva","Detecção de outliers","Correlações"]],["Visualização e entrega",["Gráficos eficazes","Dashboards","Projeto final"]]],
    "gestao-de-projetos": [["Bases do ágil",["Manifesto ágil","Papéis e responsabilidades","Cultura de time"]],["Scrum na prática",["Backlog e refinamento","Sprint e cerimônias","Definição de pronto"]],["Kanban e fluxo",["Quadro e WIP","Lead time e throughput","Melhoria contínua"]]],
    "comunicacao-corporativa": [["Clareza e estrutura",["Pirâmide invertida","Escrita objetiva","Revisão eficiente"]],["Apresentações",["Roteiro e narrativa","Slides que apoiam","Presença e voz"]]]
  }';
  s text; mods jsonb; m jsonb; mi int; ai int; cid uuid; mid uuid;
begin
  for s, mods in select * from jsonb_each(dados) loop
    select id into cid from public.cursos where slug = s;
    mi := 0;
    for m in select * from jsonb_array_elements(mods) loop
      mi := mi + 1;
      insert into public.modulos (curso_id, titulo, ordem) values (cid, m->>0, mi) returning id into mid;
      for ai in 0 .. jsonb_array_length(m->1) - 1 loop
        insert into public.aulas (modulo_id, titulo, ordem) values (mid, m->1->>ai, ai + 1);
      end loop;
    end loop;
  end loop;
end $$;