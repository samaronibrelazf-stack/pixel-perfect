import { z } from "zod";

export const apenasDigitos = (v: string) => v.replace(/\D/g, "");

export function cpfValido(valor: string) {
  const cpf = apenasDigitos(valor);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const digito = (base: number) => {
    let soma = 0;
    for (let i = 0; i < base; i++) soma += Number(cpf[i]) * (base + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(9) === Number(cpf[9]) && digito(10) === Number(cpf[10]);
}

export const formatarCpf = (v: string) =>
  apenasDigitos(v)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

export const formatarTelefone = (v: string) => {
  const d = apenasDigitos(v).slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
};

export const cadastroSchema = z.object({
  nome: z.string().trim().min(3, "Informe seu nome completo").max(120, "Nome muito longo"),
  email: z.string().trim().email("E-mail inválido").max(255),
  cpf: z.string().refine(cpfValido, "CPF inválido"),
  telefone: z
    .string()
    .refine((v) => [10, 11].includes(apenasDigitos(v).length), "Telefone inválido (DDD + número)"),
  senha: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres").max(72),
});
