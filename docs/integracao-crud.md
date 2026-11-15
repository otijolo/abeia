# Integração dos CRUDs

## Bases comparadas na integração original

- `abeia-main.zip`: conteúdo correspondente à `main` em `cbf2e66`.
- `abeia-inaxxestudo-wq-patch-Apiario-colmeia.zip`: conteúdo correspondente ao commit `efaa7b3`.
- Frontend atualizado: branch `feat/atualizacao-front`, commit `2967195`.

O commit do colega já é ancestral da `main`, que por sua vez é ancestral do frontend.
Não foi necessário copiar arquivos antigos sobre o frontend. A continuação está
na branch `feat/integracao-crud`, criada a partir de `2967195`.
A publicação com persistência Firebase continua em `feat/publicacao-render`,
baseada na main `643c3e9`. Consulte `PUBLICACAO-RENDER.md` para os endereços.

## Operações disponíveis

| Área | Criar | Consultar | Editar | Excluir |
| --- | --- | --- | --- | --- |
| Alertas | Botão Novo Alerta | Lista por situação e detalhes | Botão Editar alerta; título, motivo, origem, afetados, gravidade, situação e colmeia | Confirmação nos detalhes |
| Produção | Registrar produção | Histórico completo, total, gráfico e ranking | Botão Editar em cada colheita | Confirmação no histórico |
| Perfil | Criar perfil, quando não há cadastro | Carregamento dos dados do usuário | Salvar alterações | Excluir dados do perfil, com confirmação |

Os formulários de cadastro e edição de alertas e produção são compartilhados.
Colmeias são selecionadas pelo ID para evitar ambiguidade entre nomes iguais.
Os formulários mostram falhas de carregamento e de gravação e bloqueiam novos
envios durante uma operação. O cliente diferencia um registro inexistente (404)
de uma API indisponível; respostas vazias (204) são tratadas como ausência de dados.

No backend, as validações rejeitam campos obrigatórios vazios, estados inválidos,
unidades desconhecidas, quantidades não positivas, datas impossíveis e referências
a colmeias inexistentes. Uma edição inválida não deve alterar o registro original.

## Perfil e autenticação

O frontend usa `/api/perfil` e envia o token do Firebase em `Authorization: Bearer`.
A API identifica o usuário pela sessão validada e acessa apenas `usuarios/{uid}` no
Realtime Database. A rota antiga `/api/perfil/{uid}` continua disponível, mas
rejeita um identificador diferente do usuário autenticado.

O cadastro deixou de depender de uma gravação adicional no Realtime Database e
usa a mesma API da tela de perfil. Se a conta Firebase for criada e a API estiver
indisponível, o usuário pode completar o perfil depois pelo botão Criar perfil.

Excluir dados do perfil remove somente os dados de contato na API. Não exclui a
conta Firebase nem apiários, colmeias, alertas ou produções. Alterar o e-mail de
contato também não modifica o endereço de login. A tela Alterar senha usa a senha
atual para reautenticar no Firebase antes da atualização.

Sem token válido, a API responde 401. Os repositórios não usam mais memória para
os cadastros: todas as operações consultam e persistem no Firebase usando o token
do próprio usuário e as regras existentes do banco. Não há chave administrativa.

## Como conferir

1. Inicie a API e o frontend conforme o README e entre com sua conta Firebase.
2. Se não houver colmeias, crie um apiário e uma colmeia antes de registrar produção.
3. Crie um alerta, abra os detalhes, edite título e situação e confirme os dados após recarregar.
4. Exclua o alerta de teste e confirme sua ausência na lista da situação correspondente.
5. Registre uma colheita com `12,5` kg, edite para `18,75` kg e confira o total e o ranking.
6. Cadastre mais de quatro colheitas e confira que todas aparecem no histórico.
7. Exclua uma colheita de teste e confira a atualização dos totais.
8. No perfil, crie os dados, recarregue, edite nome e telefone e recarregue novamente.
9. Exclua somente os dados do perfil e confira a opção de criar o cadastro novamente.

O controller `/api/demo` fica desativado no perfil padrão usado na publicação.
Contas novas não recebem exemplos automaticamente; o modo de demonstração sem
login continua disponível no frontend.

## Verificações e limites

- `npm run build`: compilação TypeScript e build do frontend.
- `backend/mvnw.cmd test`: testes de integração com MockMvc para os ciclos de CRUD,
  validações, atualização de estado de alertas e independência dos perfis.
- Os testes Java usam um servidor Firebase simulado, sem alterar o banco real.
  Também verificam token ausente/inválido, isolamento por usuário, CORS, falha do
  banco, contagem de colmeias e resumo de inspeção.
- A verificação remota usou a conta de teste e um cadastro temporário removido ao
  final, confirmando que a API do Render grava no Firebase real.
- A troca real de senha exige uma conta Firebase; não é exercitada pelos testes Java.
- A geração de relatórios permanece demonstrativa e não integra este escopo de CRUD.
- Reiniciar a API não apaga cadastros. O plano gratuito do Render pode suspender o
  servidor por inatividade e atrasar a primeira requisição seguinte.
