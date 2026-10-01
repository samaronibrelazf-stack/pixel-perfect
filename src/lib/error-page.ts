export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="pt-BR">
...
    <title>Esta página não carregou</title>
...
      <h1>Esta página não carregou</h1>
      <p>Algo deu errado do nosso lado. Tente atualizar a página ou volte ao início.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Tentar novamente</button>
        <a class="secondary" href="/">Voltar ao início</a>
      </div>
    </div>
  </body>
</html>`;
}
