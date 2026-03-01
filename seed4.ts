import db from './src/db.ts';

const questions = [
  { tema: 'PREGUNTAS PROPIAS', pregunta: '¿Qué es el INGESA?', opcion_a: 'Instituto Nacional de Gestión Sanitaria', opcion_b: 'Instituto Nacional de Grandes Empresas', opcion_c: 'Instituto de Gestión Ambiental', opcion_d: 'Instituto de Garantía Social', correcta: 'a' },
  { tema: 'PREGUNTAS PROPIAS', pregunta: '¿De qué Ministerio depende el INGESA?', opcion_a: 'Ministerio de Hacienda', opcion_b: 'Ministerio de Interior', opcion_c: 'Ministerio de Sanidad', opcion_d: 'Ministerio de Trabajo', correcta: 'c' },
  { tema: 'PREGUNTAS PROPIAS', pregunta: '¿En qué ciudades tiene competencia el INGESA?', opcion_a: 'Madrid y Barcelona', opcion_b: 'Sevilla y Málaga', opcion_c: 'Valencia y Alicante', opcion_d: 'Ceuta y Melilla', correcta: 'd' },
  { tema: 'PREGUNTAS PROPIAS', pregunta: '¿Qué es la tarjeta sanitaria individual?', opcion_a: 'Un documento de identidad', opcion_b: 'Una tarjeta de crédito', opcion_c: 'Un carnet de conducir', opcion_d: 'Documento que acredita el derecho a asistencia sanitaria', correcta: 'd' },
  { tema: 'PREGUNTAS PROPIAS', pregunta: '¿Qué es el SNS?', opcion_a: 'Servicio Nacional de Seguros', opcion_b: 'Sistema Nacional de Seguridad', opcion_c: 'Servicio de Noticias Sanitarias', opcion_d: 'Sistema Nacional de Salud', correcta: 'd' },
  { tema: 'word', pregunta: '¿Cuál es la extensión por defecto de Word 2016?', opcion_a: '.doc', opcion_b: '.txt', opcion_c: '.pdf', opcion_d: '.docx', correcta: 'd' },
  { tema: 'word', pregunta: '¿Qué combinación de teclas se usa para copiar?', opcion_a: 'Ctrl + X', opcion_b: 'Ctrl + V', opcion_c: 'Ctrl + Z', opcion_d: 'Ctrl + C', correcta: 'd' },
  { tema: 'word', pregunta: '¿Qué combinación de teclas se usa para pegar?', opcion_a: 'Ctrl + C', opcion_b: 'Ctrl + X', opcion_c: 'Ctrl + S', opcion_d: 'Ctrl + V', correcta: 'd' },
  { tema: 'word', pregunta: '¿Qué combinación de teclas se usa para deshacer?', opcion_a: 'Ctrl + Y', opcion_b: 'Ctrl + S', opcion_c: 'Ctrl + P', opcion_d: 'Ctrl + Z', correcta: 'd' },
  { tema: 'word', pregunta: '¿Qué es una sangría en Word?', opcion_a: 'Un tipo de fuente', opcion_b: 'Un color de página', opcion_c: 'Un borde de tabla', opcion_d: 'Distancia entre el párrafo y el margen', correcta: 'd' },
  { tema: 'word', pregunta: '¿Cómo se inserta un salto de página manual?', opcion_a: 'Ctrl + Alt + S', opcion_b: 'Alt + Enter', opcion_c: 'Shift + Enter', opcion_d: 'Ctrl + Enter', correcta: 'd' },
  { tema: 'word', pregunta: '¿Qué es la cinta de opciones?', opcion_a: 'Una barra de estado', opcion_b: 'Un menú contextual', opcion_c: 'Una regla', opcion_d: 'Conjunto de barras de herramientas en la parte superior', correcta: 'd' },
  { tema: 'word', pregunta: '¿Qué es un encabezado?', opcion_a: 'Texto al final de la página', opcion_b: 'Texto en el margen derecho', opcion_c: 'Texto en el centro', opcion_d: 'Texto que aparece en el margen superior de cada página', correcta: 'd' },
  { tema: 'word', pregunta: '¿Qué es un pie de página?', opcion_a: 'Texto en el margen superior', opcion_b: 'Texto en el margen izquierdo', opcion_c: 'Texto en el centro', opcion_d: 'Texto que aparece en el margen inferior de cada página', correcta: 'd' },
  { tema: 'word', pregunta: '¿Qué herramienta permite corregir errores de escritura?', opcion_a: 'Diccionario de sinónimos', opcion_b: 'Traductor', opcion_c: 'Buscador', opcion_d: 'Ortografía y gramática', correcta: 'd' },
  { tema: 'word', pregunta: '¿Qué es un estilo en Word?', opcion_a: 'Un tipo de papel', opcion_b: 'Un tamaño de página', opcion_c: 'Un color de fondo', opcion_d: 'Conjunto predefinido de formatos (fuente, tamaño, etc.)', correcta: 'd' },
  { tema: 'word', pregunta: '¿Cómo se selecciona todo el documento?', opcion_a: 'Ctrl + A', opcion_b: 'Ctrl + S', opcion_c: 'Ctrl + T', opcion_d: 'Ctrl + E', correcta: 'd' },
  { tema: 'word', pregunta: '¿Qué es la combinación de correspondencia?', opcion_a: 'Enviar emails', opcion_b: 'Chatear', opcion_c: 'Imprimir sobres', opcion_d: 'Crear documentos personalizados para varios destinatarios', correcta: 'd' },
  { tema: 'word', pregunta: '¿Qué es una macro?', opcion_a: 'Un virus', opcion_b: 'Un documento grande', opcion_c: 'Un tipo de imagen', opcion_d: 'Serie de comandos grabados para automatizar tareas', correcta: 'd' },
  { tema: 'word', pregunta: '¿Qué es el formato de párrafo?', opcion_a: 'Cambiar el tipo de letra', opcion_b: 'Cambiar el color del texto', opcion_c: 'Insertar imágenes', opcion_d: 'Alineación, interlineado y espaciado', correcta: 'd' }
];

const stmt = db.prepare("INSERT INTO preguntas (tema, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, correcta) VALUES (?, ?, ?, ?, ?, ?, ?)");
const insertMany = db.transaction((qs) => {
  for (const q of qs) {
    stmt.run(q.tema, q.pregunta, q.opcion_a, q.opcion_b, q.opcion_c, q.opcion_d, q.correcta);
  }
});
insertMany(questions);
console.log('Seeded PREGUNTAS PROPIAS and word questions');
