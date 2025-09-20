export default async function handler(req, res) {
  // Importa o handler do arquivo interno
  const osHandler = await import('./os/os.js');
  return osHandler.default(req, res);
}
