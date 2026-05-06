/**
 * questions.js
 * Banco de preguntas del quiz.
 * Cada pregunta tiene:
 *   id, category, difficulty, question, code (opcional),
 *   options[], correct (índice 0-3), explanation
 */

const QUESTIONS = [
    // ── HTML ─────────────────────────────────────
    {
        id: 1,
        category: 'html',
        difficulty: 'easy',
        question: '¿Cuál etiqueta HTML5 es la más apropiada para el contenido principal de una página?',
        options: ['<div id="main">', '<main>', '<section>', '<content>'],
        correct: 1,
        explanation: '<main> es el elemento semántico de HTML5 diseñado específicamente para el contenido principal. Solo debe haber uno por página.'
    },
    {
        id: 2,
        category: 'html',
        difficulty: 'easy',
        question: '¿Qué atributo hace que un campo de formulario sea obligatorio?',
        options: ['mandatory', 'validate', 'required', 'must'],
        correct: 2,
        explanation: 'El atributo "required" en un <input> activa la validación nativa del navegador y evita el envío del formulario si el campo está vacío.'
    },
    {
        id: 3,
        category: 'html',
        difficulty: 'medium',
        question: '¿Qué imprime este código en el orden del DOM?',
        code: '<article>\n  <header>Título</header>\n  <p>Párrafo</p>\n  <footer>Pie</footer>\n</article>',
        options: [
            'Título → Pie → Párrafo',
            'Error: footer no puede ir dentro de article',
            'Título → Párrafo → Pie',
            'Párrafo → Título → Pie'
        ],
        correct: 2,
        explanation: 'El DOM sigue el orden del HTML. <header>, <p> y <footer> se renderizan en el orden en que aparecen: Título → Párrafo → Pie.'
    },
    {
        id: 4,
        category: 'html',
        difficulty: 'hard',
        question: '¿Cuál es la diferencia correcta entre <b> y <strong>?',
        options: [
            'No hay diferencia, son sinónimos',
            '<b> es visual (negrita), <strong> tiene importancia semántica',
            '<strong> es más moderno y reemplaza completamente a <b>',
            '<b> tiene mayor peso en SEO que <strong>'
        ],
        correct: 1,
        explanation: '<b> aplica negrita solo visualmente. <strong> indica que el contenido tiene mayor importancia semántica, lo cual también comunica a lectores de pantalla y motores de búsqueda.'
    },

    // ── CSS ──────────────────────────────────────
    {
        id: 5,
        category: 'css',
        difficulty: 'easy',
        question: '¿Cuál propiedad CSS se usa para crear un layout de cuadrícula?',
        options: ['display: flex', 'display: grid', 'display: table', 'display: block'],
        correct: 1,
        explanation: 'display: grid activa el CSS Grid Layout, que permite crear layouts bidimensionales (filas y columnas) de forma nativa.'
    },
    {
        id: 6,
        category: 'css',
        difficulty: 'medium',
        question: '¿Qué valor de "position" saca un elemento del flujo normal del documento?',
        options: ['relative', 'static', 'absolute', 'sticky'],
        correct: 2,
        explanation: 'position: absolute saca el elemento del flujo normal. Se posiciona respecto a su ancestro con position distinto de static. Los demás elementos actúan como si no existiera.'
    },
    {
        id: 7,
        category: 'css',
        difficulty: 'medium',
        question: '¿Cuál es el resultado de esta especificidad?',
        code: '/* Selector A */ #hero .title\n/* Selector B */ .page .section h1',
        options: [
            'Selector A gana (1-1-0) vs (0-2-1)',
            'Selector B gana por más selectores',
            'Empatan en especificidad',
            'Selector B gana por la etiqueta h1'
        ],
        correct: 0,
        explanation: 'Un ID (#) vale 1-0-0. Selector A: 1 ID + 1 clase = (1,1,0). Selector B: 2 clases + 1 etiqueta = (0,2,1). El ID domina: A gana.'
    },
    {
        id: 8,
        category: 'css',
        difficulty: 'hard',
        question: '¿Cuál es el orden correcto de la cascada CSS para resolver conflictos?',
        options: [
            'Especificidad → Origen → Orden de aparición',
            'Origen → Especificidad → Orden de aparición',
            'Orden de aparición → Especificidad → Origen',
            'Especificidad → Orden de aparición → Origen'
        ],
        correct: 1,
        explanation: 'CSS resuelve conflictos en este orden: 1) Origen (browser < author < user + !important), 2) Especificidad (ID > clase > etiqueta), 3) Orden de aparición (último gana).'
    },
    {
        id: 9,
        category: 'css',
        difficulty: 'easy',
        question: '¿Qué hace "box-sizing: border-box"?',
        options: [
            'Agrega un borde automático a los elementos',
            'Incluye padding y border dentro del width/height definido',
            'Elimina los márgenes entre elementos',
            'Hace que el box sea cuadrado'
        ],
        correct: 1,
        explanation: 'Con border-box, el padding y el border se restan del ancho disponible en lugar de sumarse. Si defines width: 200px con padding: 20px, el contenido será 160px (200 - 2×20).'
    },

    // ── JAVASCRIPT ───────────────────────────────
    {
        id: 10,
        category: 'javascript',
        difficulty: 'easy',
        question: '¿Cuál es la diferencia entre "==" y "===" en JavaScript?',
        options: [
            'No hay diferencia práctica en código moderno',
            '=== también compara el tipo de dato, == no',
            '== es más rápido porque no verifica tipos',
            '=== solo funciona con strings y numbers'
        ],
        correct: 1,
        explanation: '== hace coerción de tipo antes de comparar ("5" == 5 → true). === compara valor Y tipo sin coerción ("5" === 5 → false). Siempre usa === en código profesional.'
    },
    {
        id: 11,
        category: 'javascript',
        difficulty: 'easy',
        question: '¿Qué devuelve este código?',
        code: 'typeof null',
        options: ['"null"', '"undefined"', '"object"', '"number"'],
        correct: 2,
        explanation: 'typeof null devuelve "object". Esto es un bug histórico de JavaScript que no se puede corregir por compatibilidad. Para verificar null usa === null.'
    },
    {
        id: 12,
        category: 'javascript',
        difficulty: 'medium',
        question: '¿Qué imprime este código?',
        code: 'const arr = [1, 2, 3];\nconsole.log(arr.map(x => x * 2).filter(x => x > 3));',
        options: ['[4, 6]', '[2, 4, 6]', '[6]', '[1, 2, 3]'],
        correct: 0,
        explanation: 'map(x => x * 2) convierte [1,2,3] → [2,4,6]. Luego filter(x => x > 3) filtra los mayores a 3 → [4,6]. Son métodos encadenables que devuelven nuevos arrays.'
    },
    {
        id: 13,
        category: 'javascript',
        difficulty: 'medium',
        question: '¿Cuál de estas formas crea una copia superficial (shallow copy) de un objeto?',
        options: [
            'const b = a;',
            'const b = Object.deepCopy(a);',
            'const b = { ...a };',
            'const b = a.clone();'
        ],
        correct: 2,
        explanation: 'const b = { ...a } usa spread operator y crea una copia superficial. const b = a solo copia la referencia (ambas variables apuntan al mismo objeto).'
    },
    {
        id: 14,
        category: 'javascript',
        difficulty: 'hard',
        question: '¿Cuál es el output de este código?',
        code: 'console.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);',
        options: ['1, 2, 3, 4', '1, 4, 3, 2', '1, 4, 2, 3', '4, 1, 3, 2'],
        correct: 1,
        explanation: 'Event loop: 1) Call stack sincrono → 1, 4. 2) Microtasks (Promises) → 3. 3) Macrotasks (setTimeout) → 2. El orden es: 1 → 4 → 3 → 2.'
    },
    {
        id: 15,
        category: 'javascript',
        difficulty: 'hard',
        question: '¿Qué imprime este código con closures?',
        code: 'for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}',
        options: ['0, 1, 2', '3, 3, 3', '0, 0, 0', 'undefined, undefined, undefined'],
        correct: 1,
        explanation: 'var tiene scope de función, no de bloque. El setTimeout ejecuta cuando el for ya terminó, e i ya es 3. Con "let" obtendríamos 0, 1, 2 porque let crea un binding por iteración.'
    },
    {
        id: 16,
        category: 'javascript',
        difficulty: 'medium',
        question: '¿Qué hace el método Array.prototype.reduce()?',
        options: [
            'Elimina elementos duplicados de un array',
            'Acumula los valores del array en un único resultado',
            'Reduce el tamaño del array a la mitad',
            'Filtra los elementos según una condición'
        ],
        correct: 1,
        explanation: 'reduce() acumula todos los elementos del array en un valor único. Ejemplo: [1,2,3].reduce((acc, val) => acc + val, 0) devuelve 6. Puede producir cualquier tipo de valor.'
    },

    // ── GENERAL ──────────────────────────────────
    {
        id: 17,
        category: 'general',
        difficulty: 'easy',
        question: '¿Qué significa "HTTP" en el contexto web?',
        options: [
            'HyperText Transfer Protocol',
            'High Traffic Transfer Protocol',
            'HyperText Template Processing',
            'Hosted Text Transfer Protocol'
        ],
        correct: 0,
        explanation: 'HTTP (HyperText Transfer Protocol) es el protocolo de comunicación base de la web. Define cómo se intercambian mensajes entre clientes (browsers) y servidores.'
    },
    {
        id: 18,
        category: 'general',
        difficulty: 'easy',
        question: '¿Qué comando de Git se usa para guardar cambios en el repositorio local?',
        options: ['git save', 'git push', 'git commit', 'git store'],
        correct: 2,
        explanation: '"git commit" guarda un snapshot de los cambios en el repositorio local. Usa "git push" para enviar esos commits al repositorio remoto (GitHub).'
    },
    {
        id: 19,
        category: 'general',
        difficulty: 'medium',
        question: '¿Cuál es la diferencia entre una API REST y GraphQL?',
        options: [
            'GraphQL solo funciona con JavaScript, REST con cualquier lenguaje',
            'En REST los endpoints definen los datos; en GraphQL el cliente especifica exactamente qué datos necesita',
            'REST es más moderno y está reemplazando a GraphQL',
            'GraphQL requiere una base de datos especial'
        ],
        correct: 1,
        explanation: 'En REST, cada endpoint devuelve una estructura fija. En GraphQL, el cliente envía una query especificando exactamente los campos que necesita, evitando over-fetching y under-fetching.'
    },
    {
        id: 20,
        category: 'general',
        difficulty: 'medium',
        question: '¿Qué es el "Critical Rendering Path" en un navegador?',
        options: [
            'La ruta de archivos críticos que el servidor siempre debe tener disponibles',
            'La secuencia de pasos que el navegador sigue para convertir HTML/CSS/JS en píxeles en pantalla',
            'El camino más corto entre dos páginas web',
            'Los archivos CSS que bloquean la carga de la página'
        ],
        correct: 1,
        explanation: 'El Critical Rendering Path es la secuencia: HTML → DOM, CSS → CSSOM, DOM + CSSOM → Render Tree → Layout → Paint. Optimizarlo mejora el tiempo de primera pintura (FCP).'
    },
    {
        id: 21,
        category: 'general',
        difficulty: 'hard',
        question: '¿Qué es el "CORS" y cuándo ocurre un error de CORS?',
        options: [
            'Un tipo de ataque XSS que roba cookies entre dominios',
            'Un error de sintaxis CSS que no parsea correctamente',
            'Una política de seguridad del navegador que bloquea peticiones a dominios distintos al origen',
            'Un protocolo que reemplaza a HTTPS para sitios seguros'
        ],
        correct: 2,
        explanation: 'CORS (Cross-Origin Resource Sharing) es una política de seguridad del navegador. Bloquea peticiones fetch/XHR a un dominio diferente al que sirve la página, a menos que el servidor incluya los headers Access-Control-Allow-Origin correctos.'
    }
];