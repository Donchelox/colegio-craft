/**
 * ColegioCraft 3D - Base de Datos Académica (2° Básico)
 * Contenidos alineados a los cuadernos de estudio de Historia, Ciencias, Lenguaje y Matemáticas.
 */

// Las 4 Puertas Mágicas del Lobby Central
export const LOBBY_DOORS = [
    {
        id: 'door_historia',
        targetWorld: 'historia',
        name: 'PUERTA 1: HISTORIA Y GEOGRAFÍA',
        subtitle: 'Pueblos Originarios de Chile • 6 Mini-Juegos',
        emoji: '🏺',
        pos: { x: 0, y: 0, z: -24 },
        color: 0xd97706,
        frameColor: 0xfbbf24,
        accentColor: '#d97706',
        locked: false
    },
    {
        id: 'door_ciencias',
        targetWorld: 'ciencias',
        name: 'PUERTA 2: CIENCIAS NATURALES',
        subtitle: 'Cuerpo Humano, Animales y Agua • 6 Mini-Juegos',
        emoji: '🔬',
        pos: { x: 24, y: 0, z: 0 },
        color: 0x16a34a,
        frameColor: 0x4ade80,
        accentColor: '#16a34a',
        locked: false
    },
    {
        id: 'door_lenguaje',
        targetWorld: 'lenguaje',
        name: 'PUERTA 3: LENGUAJE Y COMUNICACIÓN',
        subtitle: 'Cómic, Cuentos y Comprensión • 5 Mini-Juegos',
        emoji: '📚',
        pos: { x: -24, y: 0, z: 0 },
        color: 0xc026d3,
        frameColor: 0xf472b6,
        accentColor: '#c026d3',
        locked: false
    },
    {
        id: 'door_matematicas',
        targetWorld: 'matematicas',
        name: 'PUERTA 4: MATEMÁTICAS',
        subtitle: 'Desafíos Numéricos, Decenas y Cuerpos 3D',
        emoji: '🔢',
        pos: { x: 0, y: 0, z: 24 },
        color: 0x0284c7,
        frameColor: 0x38bdf8,
        accentColor: '#0284c7',
        locked: false // ¡Habilitado con contenido interactivo de 2° Básico!
    }
];

// Estaciones de aprendizaje por Mundo
export const WORLD_STATIONS = {
    // ================= MUNDO 1: HISTORIA Y GEOGRAFÍA =================
    historia: [
        {
            id: 'hist_aymara',
            name: 'Pueblo Aymara (Zona Norte)',
            emoji: '🦙',
            zone: 'ZONA NORTE • ALTIPLANO',
            badge: 'SEDENTARIO',
            pos: { x: -9, y: 0, z: -36 },
            color: 0xd97706,
            boxTitles: ['🏠 Vivienda (Uta)', '🌽 Alimentación', '🧶 Súper Habilidad'],
            story: '¡Kamisaraki! Somos el pueblo Aymara y vivimos en el Altiplano de la Zona Norte, a gran altura donde el clima es frío y seco. Somos SEDENTARIOS porque vivimos permanentemente en nuestras aldeas.',
            house: 'Casas llamadas UTA, hechas de piedra, barro y techo de paja, ¡sin ventanas para guardar el calor!',
            food: 'Agricultura en terrazas (papas, maíz y quinoa) y pastoreo de llamas y alpacas.',
            skill: 'Tejemos ropa abrigada con lana de llamas y alpacas, que también nos ayudan a transportar carga.',
            question: '¿Por qué el pueblo Aymara es considerado un pueblo SEDENTARIO?',
            options: [
                { text: 'A) Porque viajaban en canoas por los canales del sur.', correct: false },
                { text: 'B) Porque vivían en un mismo lugar, cultivaban papas y quinoa y criaban llamas.', correct: true },
                { text: 'C) Porque armaban carpas de cuero de lobo marino en la playa.', correct: false }
            ]
        },
        {
            id: 'hist_lickanantay',
            name: 'Lickanantay y Diaguitas (Norte)',
            emoji: '🏺',
            zone: 'ZONA NORTE • OASIS Y VALLES',
            badge: 'SEDENTARIO',
            pos: { x: 11, y: 0, z: -34 },
            color: 0xb45309,
            boxTitles: ['🏠 Vivienda Firme', '💧 Cuidado del Agua', '🏺 Alfarería y Metales'],
            story: '¡Hola explorador! Los Lickanantay (Atacameños) habitamos los oasis y quebradas del Desierto de Atacama, y más al sur en los valles vivían los Diaguitas. ¡Como el desierto es muy seco, el agua era nuestro tesoro más cuidado!',
            house: 'Viviendas permanentes hechas de piedra, barro (adobe), ramas entrelazadas y madera.',
            food: 'Cultivábamos maíz, papas y porotos usando el agua de los ríos y vertientes del oasis.',
            skill: 'Los Diaguitas destacaron por su hermosa alfarería en greda (cerámica) e intercambio de productos.',
            question: '¿Por qué el agua era tan importante para el pueblo Lickanantay (Atacameño)?',
            options: [
                { text: 'A) Porque vivían en el desierto de Atacama (muy seco) y la necesitaban para vivir y cultivar.', correct: true },
                { text: 'B) Porque vivían sobre glaciares de hielo.', correct: false },
                { text: 'C) Porque no practicaban la agricultura.', correct: false }
            ]
        },
        {
            id: 'hist_chango',
            name: 'Pueblo Chango (Costa Norte)',
            emoji: '🦭',
            zone: 'ZONA NORTE • COSTA',
            badge: 'NÓMADA DEL MAR',
            pos: { x: -15, y: 0, z: -16 },
            color: 0x0284c7,
            boxTitles: ['⛺ Toldo Costero', '🐟 Recursos del Mar', '🛶 Balsa de Lobo Marino'],
            story: '¡Saludos desde la costa del Norte! Somos el pueblo Chango. Éramos NÓMADAS costeros: nos trasladábamos por la orilla del océano siguiendo los peces, mariscos y algas.',
            house: 'Toldos livianos hechos con huesos gigantes de costillas de ballena cubiertos con cuero de lobo marino.',
            food: 'Pescadores, cazadores y recolectores de peces, mariscos y algas marinas.',
            skill: '¡Hacíamos balsas inflables con pieles de lobo marino para desplazarnos y pescar en el mar!',
            question: '¿Qué embarcación construían los Changos para navegar por la costa norte de Chile?',
            options: [
                { text: 'A) Balsas hechas con pieles de lobo marino.', correct: true },
                { text: 'B) Barcos de hierro a vapor.', correct: false },
                { text: 'C) Carretas tiradas por alpacas.', correct: false }
            ]
        },
        {
            id: 'hist_mapuche',
            name: 'Pueblo Mapuche (Centro-Sur)',
            emoji: '🌲',
            zone: 'ZONA CENTRO-SUR',
            badge: 'SEDENTARIO',
            pos: { x: 0, y: 0, z: 2 },
            color: 0x16a34a,
            boxTitles: ['🏠 La Ruka', '🌱 Tierra y Piñón', '🗣️ Mapuzugun y Tradición'],
            story: '¡Mari Mari! Somos el pueblo Mapuche ("Gente de la tierra"), el más numeroso de Chile. Habitamos entre los ríos Aconcagua y Toltén en valles, bosques y lagos. Grupos como Pikunche, Mapuche, Williche y Lafkenche fueron sedentarios.',
            house: 'La RUKA, vivienda grande y resistente de madera y paja con un fogón comunitario al centro.',
            food: 'Cultivaban maíz, papas y ají, y recolectaban frutos silvestres como el piñón de la araucaria.',
            skill: 'Hablamos mapuzugun y mantenemos ceremonias como el Wiñol Txipantu (21 de junio), Guillatún y Machitún.',
            question: '¿Qué elementos del pueblo Mapuche se mantienen vivos en la actualidad (continuidad)?',
            options: [
                { text: 'A) Su lengua mapuzugun, su respeto por la naturaleza y ceremonias como el Wiñol Txipantu y Guillatún.', correct: true },
                { text: 'B) Ninguno, porque ya no existen sus tradiciones.', correct: false },
                { text: 'C) Que todos viven en carpas de hielo.', correct: false }
            ]
        },
        {
            id: 'hist_chono_yagan',
            name: 'Chonos, Kawésqar y Yaganes',
            emoji: '🛶',
            zone: 'ZONA SUR Y AUSTRAL • CANALES',
            badge: 'NÓMADAS CANOEROS',
            pos: { x: -12, y: 0, z: 28 },
            color: 0x0ea5e9,
            boxTitles: ['🛶 Dalca, Hallef y Ánan', '🐚 Buceo y Cestería', '🔥 Fuego en la Canoa'],
            story: '¡Bienvenidos a los lluviosos canales y fiordos del Sur! Chonos, Kawésqar y Yaganes fuimos pueblos NÓMADAS del mar. Navegábamos entre islas; entre los Chonos, ¡las mujeres buceaban en el agua helada para recolectar mariscos!',
            house: 'Chozas livianas de ramas cubiertas de cuero, y embarcaciones como la DALCA (Chono) y el HALLEF de corteza (Kawésqar).',
            food: 'Pesca, caza de lobos marinos y recolección de mariscos con cestos tejidos.',
            skill: '¡Mantenían fuego encendido adentro de sus embarcaciones y vestían pieles de lobo marino o nutria para protegerse del frío!',
            question: '¿Cómo se protegían del frío los pueblos canoeros del sur mientras navegaban en sus dalcas?',
            options: [
                { text: 'A) Instalaban fuego adentro de sus embarcaciones y se vestían con pieles de animales.', correct: true },
                { text: 'B) Usaban calefacción eléctrica.', correct: false },
                { text: 'C) Construían casas de ladrillo y cemento en el mar.', correct: false }
            ]
        },
        {
            id: 'hist_selknam_legado',
            name: 'Selk\'nam y Nuestro Legado Hoy',
            emoji: '🏹',
            zone: 'TIERRA DEL FUEGO Y ACTUALIDAD',
            badge: 'NÓMADA Y LEGADO',
            pos: { x: 10, y: 0, z: 32 },
            color: 0xe11d48,
            boxTitles: ['⛺ Cono y Ceremonia Hain', '🌽 Palabras y Alimentos', '🤝 Diversidad en Chile'],
            story: 'En Tierra del Fuego vivieron los Selk\'nam (nómadas terrestres y hábiles cazadores que pintaban sus cuerpos en la ceremonia del Hain). Hoy estudiamos a todos los pueblos originarios porque son parte de nuestra identidad cultural.',
            house: 'Los Selk\'nam construían viviendas en forma de CONO con ramas y pieles de guanaco.',
            food: 'Heredamos alimentos como la papa, el maíz y el merquén, y palabras como cóndor, puma y guagua.',
            skill: 'Hoy valoramos a hablantes como Cristina Calderón (yagán), al Pueblo Afrodescendiente y a inmigrantes como los alemanes.',
            question: '¿Por qué seguimos estudiando y valorando a los pueblos originarios de Chile hoy?',
            options: [
                { text: 'A) Porque fueron los primeros habitantes y sus aportes (alimentos, palabras, tejidos y respeto a la naturaleza) siguen vivos hoy.', correct: true },
                { text: 'B) Porque llegaron después de los españoles.', correct: false },
                { text: 'C) Porque construyeron edificios modernos.', correct: false }
            ]
        }
    ],

    // ================= MUNDO 2: CIENCIAS NATURALES =================
    ciencias: [
        {
            id: 'cie_corazon',
            name: 'Doctora Latido: El Corazón y Órganos',
            emoji: '❤️',
            zone: 'UNIDAD 1 • CUERPO HUMANO',
            badge: 'ÓRGANOS INTERNOS',
            pos: { x: -12, y: 0, z: -22 },
            color: 0xe11d48,
            boxTitles: ['❤️ El Corazón', '🫁 Pulmones y Estómago', '🦴 Esqueleto y Músculos'],
            story: '¡Hola científico! Dentro de nuestro cuerpo tenemos órganos fundamentales para vivir. Mira el gran Corazón 3D que late a mi lado: su misión es bombear sangre a todo el cuerpo para mantenernos con vida.',
            house: 'Pesa unos 300 gramos, tiene el tamaño de un puño cerrado y late 70 veces por minuto (¡100 mil veces al día!) gracias a su propia electricidad.',
            food: 'Los PULMONES nos permiten respirar aire, y el ESTÓMAGO se encarga de digerir los alimentos que comemos.',
            skill: 'El ESQUELETO (huesos) nos mantiene erguidos y firmes sin desplomarnos, y junto a los MÚSCULOS nos permite movernos.',
            question: '¿Cuál es la función principal del corazón y a qué se asemeja su tamaño?',
            options: [
                { text: 'A) Bombea sangre a todo el cuerpo para mantener la vida y tiene el tamaño de un puño cerrado.', correct: true },
                { text: 'B) Sirve para masticar la comida y está en los pies.', correct: false },
                { text: 'C) Nunca se mueve ni late.', correct: false }
            ]
        },
        {
            id: 'cie_ejercicio',
            name: 'Entrenador Activo: Ejercicio y Salud',
            emoji: '🏃',
            zone: 'UNIDAD 1 • VIDA SALUDABLE',
            badge: '60 MINUTOS AL DÍA',
            pos: { x: 12, y: 0, z: -22 },
            color: 0xf97316,
            boxTitles: ['⚡ Cambios al Ejercitar', '💪 Beneficios Activos', '🛋️ Peligro del Sedentarismo'],
            story: '¡A moverse! Cuando hacemos actividad física (como correr, saltar la cuerda o andar en bicicleta), nuestro corazón late más rápido, respiramos más deprisa y sudamos. ¡Lo recomendado es hacer 60 minutos de actividad física al día!',
            house: 'Al hacer ejercicio el corazón bombea más rápido para llevar oxígeno y energía a los músculos.',
            food: 'Beneficios: nos da más energía, apoya el crecimiento de huesos y músculos sanos y cuida el corazón.',
            skill: 'Si pasamos todo el día acostados comiendo comida chatarra sin movernos (inactividad), nos cansamos rápido y dañamos la salud.',
            question: '¿Cuántos minutos de actividad física al día se recomiendan para los niños y qué beneficio nos entrega?',
            options: [
                { text: 'A) Se recomiendan 60 minutos al día; fortalece huesos, músculos y nos da más energía.', correct: true },
                { text: 'B) Cero minutos, es mejor no moverse nunca.', correct: false },
                { text: 'C) Debilita los huesos.', correct: false }
            ]
        },
        {
            id: 'cie_vertebrados',
            name: 'Guardaparque: Peces, Anfibios y Reptiles',
            emoji: '🐸',
            zone: 'UNIDAD 2 • VERTEBRADOS',
            badge: 'CON ESQUELETO',
            pos: { x: -14, y: 0, z: 4 },
            color: 0x16a34a,
            boxTitles: ['🐸 Anfibios (Ranas)', '🐟 Peces', '🦎 Reptiles y Aves'],
            story: '¡Observa la laguna! Los animales VERTEBRADOS tienen esqueleto interno con columna vertebral. Se dividen en 5 grupos: Peces, Anfibios, Reptiles, Aves y Mamíferos. ¡Cada uno tiene una cubierta corporal y respiración especial!',
            house: 'ANFIBIOS: Tienen piel desnuda y húmeda. Al crecer pasan por la METAMORFOSIS (de renacuajo con branquias en el agua a rana con pulmones).',
            food: 'PECES: Viven en el agua, tienen el cuerpo cubierto de escamas, nadan con aletas y respiran por BRANQUIAS.',
            skill: 'REPTILES: Reptan y tienen escamas duras. AVES: Tienen plumas, pico, alas y respiran por pulmones.',
            question: '¿Qué características principales tienen los ANFIBIOS (como la rana) y los PECES?',
            options: [
                { text: 'A) Los anfibios tienen piel desnuda/húmeda y hacen metamorfosis; los peces tienen escamas y respiran por branquias.', correct: true },
                { text: 'B) Los anfibios tienen plumas y los peces tienen pelos.', correct: false },
                { text: 'C) Ninguno de los dos tiene huesos.', correct: false }
            ]
        },
        {
            id: 'cie_invertebrados',
            name: 'Exploradora Bichito: Artrópodos',
            emoji: '🦋',
            zone: 'UNIDAD 2 • INVERTEBRADOS',
            badge: 'PATAS ARTICULADAS',
            pos: { x: 14, y: 0, z: 4 },
            color: 0x9333ea,
            boxTitles: ['🐞 ¿Qué es Invertebrado?', '🦋 Insectos (6 patas)', '🕷️ Arácnidos (8 patas)'],
            story: '¡Mira con la lupa! Los animales INVERTEBRADOS NO tienen esqueleto interno ni columna vertebral. El grupo más grande son los ARTRÓPODOS: se llaman así porque sus patas tienen articulaciones y se doblan en partes como nuestros dedos.',
            house: 'Los agrupamos y diferenciamos observando su cuerpo y su CANTIDAD DE PATAS articuladas.',
            food: 'INSECTOS (como la mariposa, abeja o chinita): tienen 6 patas, 2 antenas y muchos tienen alas.',
            skill: 'ARÁCNIDOS (como la araña o escorpión): tienen 8 patas y NO tienen antenas ni alas.',
            question: '¿Qué diferencia a los animales invertebrados de los vertebrados, y cuántas patas tienen los insectos vs las arañas?',
            options: [
                { text: 'A) Los invertebrados no tienen columna vertebral; los insectos tienen 6 patas y los arácnidos (arañas) tienen 8 patas.', correct: true },
                { text: 'B) Los invertebrados tienen huesos gigantes de hierro.', correct: false },
                { text: 'C) Las arañas tienen 2 patas y plumas.', correct: false }
            ]
        },
        {
            id: 'cie_ciclos',
            name: 'Profesora Vida: Ciclos y Hábitat',
            emoji: '🌱',
            zone: 'UNIDAD 2 • CICLOS DE VIDA',
            badge: 'ETAPAS Y CUIDADO',
            pos: { x: -10, y: 0, z: 26 },
            color: 0x059669,
            boxTitles: ['🦋 Ciclo de la Mariposa', '👶 Ciclo del Ser Humano', '🌍 Peligro de Extinción'],
            story: '¡Todo ser vivo pasa por un CICLO DE VIDA con cambios de tamaño y etapas desde que nace hasta que crece! Además, debemos proteger los hábitats naturales para ayudar a los animales en peligro de extinción.',
            house: 'Ciclo de un insecto (Mariposa): 1° Huevo -> 2° Larva (oruga) -> 3° Pupa o crisálida -> 4° Mariposa adulta.',
            food: 'Ciclo humano: nacemos como bebés, crecemos a niños, luego jóvenes, adultos y ancianos.',
            skill: 'Para proteger a los animales en peligro de extinción debemos cuidar su hábitat, no contaminar el agua ni talar sus bosques.',
            question: '¿Cuáles son las etapas correctas de la metamorfosis en el ciclo de vida de una mariposa?',
            options: [
                { text: 'A) Huevo, larva (oruga), pupa (crisálida) y mariposa adulta.', correct: true },
                { text: 'B) Renacuajo con branquias y luego pez.', correct: false },
                { text: 'C) Nace directamente siendo grande sin cambiar nunca.', correct: false }
            ]
        },
        {
            id: 'cie_agua',
            name: 'Científico Aqua: Laboratorio del Agua',
            emoji: '💧',
            zone: 'UNIDAD 3 • EL AGUA',
            badge: 'ESCURRE Y DISUELVE',
            pos: { x: 10, y: 0, z: 26 },
            color: 0x0284c7,
            boxTitles: ['🌊 Escurre y se Adapta', '🥄 Poder Disolvente', '☀️ Evaporación y Hielo'],
            story: '¡Bienvenido al Laboratorio del Agua! Aquí experimentamos con el agua líquida: si la derramamos sobre la mesa no se queda quieta como un lápiz, ¡sino que ESCURRE! Y cuando la ponemos en un vaso o botella, SE ADAPTA a la forma del recipiente.',
            house: 'El agua líquida no tiene forma propia: escurre y toma la forma del envase que la contiene.',
            food: 'Es un gran DISOLVENTE: al revolver azúcar o sal en agua se disuelven (parecen desaparecer), pero las piedrecillas NO se disuelven.',
            skill: 'Con el calor del sol el agua líquida se EVAPORA (así se seca la ropa tendida), y en el congelador se CONGELA (estado sólido).',
            question: '¿Qué ocurre si revolvemos azúcar en un vaso con agua en comparación con echar piedrecillas?',
            options: [
                { text: 'A) El agua disuelve el azúcar gracias a su poder disolvente, pero las piedrecillas no se disuelven.', correct: true },
                { text: 'B) Las piedrecillas se derriten y el azúcar se vuelve piedra.', correct: false },
                { text: 'C) El agua se queda dura como un lápiz.', correct: false }
            ]
        }
    ],

    // ================= MUNDO 3: LENGUAJE Y COMUNICACIÓN =================
    lenguaje: [
        {
            id: 'len_comic',
            name: 'Capitán Viñeta: El Mundo del Cómic',
            emoji: '💬',
            zone: 'SEMANA 27 • EL CÓMIC',
            badge: 'TEXTO LITERARIO',
            pos: { x: -12, y: 0, z: -20 },
            color: 0xc026d3,
            boxTitles: ['📚 ¿Qué tipo de texto es?', '🖼️ Viñetas y Orden', '💭 Globos y Sonidos'],
            story: '¡PLOP! ¡Bienvenido a la Ciudad del Cómic! En tu cuaderno aprendimos que el CÓMIC pertenece al grupo de los TEXTOS LITERARIOS. Su propósito es contar una historia mezclando imágenes y texto.',
            house: 'Es un Texto Literario que se cuenta de manera cronológica y tiene Inicio, Desarrollo y Desenlace.',
            food: 'Cada cuadro de la historieta se llama VIÑETA. Los personajes hablan usando GLOBOS DE DIÁLOGO.',
            skill: 'Cuando un personaje piensa (como Garfield con nubecitas), usa un GLOBO DE PENSAMIENTO, y los ruidos como "¡CUIIC!" son ONOMATOPEYAS.',
            question: '¿A qué grupo de textos pertenece el CÓMIC y cuál es su propósito?',
            options: [
                { text: 'A) Pertenece a los Textos Literarios y su propósito es contar una historia mezclando imágenes y texto.', correct: true },
                { text: 'B) Pertenece a las recetas de cocina para hacer batidos.', correct: false },
                { text: 'C) Solo tiene números y no cuenta ninguna historia.', correct: false }
            ]
        },
        {
            id: 'len_localizar',
            name: 'Detective Lupa: Localizar Información',
            emoji: '🔍',
            zone: 'CLASE 1 Y 2 • COMPRENSIÓN',
            badge: 'INFORMACIÓN EXPLÍCITA',
            pos: { x: 12, y: 0, z: -20 },
            color: 0x0284c7,
            boxTitles: ['👁️ Información Explícita', '👣 Los 4 Pasos Clave', '🖍️ Técnica del Subrayado'],
            story: '¡Elemental, querido lector! Localizar información es buscar datos dentro de un texto. La INFORMACIÓN EXPLÍCITA es aquella que está a simple vista escrita en el texto y solo debemos encontrarla.',
            house: 'La información explícita aparece directamente en el texto; no está oculta.',
            food: 'Los 4 pasos son: 1° Leer el texto, 2° Leer la pregunta, 3° Buscar la información en el texto y subrayarla, y 4° Responder.',
            skill: 'Subrayar la pista en el texto te asegura responder sin equivocarte.',
            question: 'Según tu cuaderno de Lenguaje, ¿qué es la INFORMACIÓN EXPLÍCITA y qué debemos hacer para localizarla?',
            options: [
                { text: 'A) Es la información que está a simple vista en el texto; debemos leer el texto, leer la pregunta, buscar/subrayar y responder.', correct: true },
                { text: 'B) Es información que no sale en el texto y hay que adivinar sin leer.', correct: false },
                { text: 'C) Es responder la pregunta antes de leer el texto.', correct: false }
            ]
        },
        {
            id: 'len_vocabulario',
            name: 'Sabio Contexto: Vocabulario Contextual',
            emoji: '🧩',
            zone: 'SEMANA 19 • INTERPRETAR',
            badge: 'PISTAS DEL TEXTO',
            pos: { x: -12, y: 0, z: 6 },
            color: 0x7c3aed,
            boxTitles: ['❓ ¿Palabra desconocida?', '🧭 ¿Qué es el Contexto?', '💡 Inferir el significado'],
            story: '¿Qué te ocurre cuando estás leyendo y aparece una palabra que no conoces? ¡No te detengas ni te rindas! Podemos descubrir su significado usando el VOCABULARIO CONTEXTUAL.',
            house: 'El CONTEXTO es todo lo que rodea a la palabra que no conocemos dentro del texto.',
            food: 'Al leer las palabras y oraciones vecinas, encontramos pistas para deducir qué significa la palabra nueva.',
            skill: 'Así comprendemos mejor la lectura y aprendemos palabras nuevas de forma ordenada y entusiasta.',
            question: '¿A qué nos referimos con el CONTEXTO en el vocabulario contextual?',
            options: [
                { text: 'A) A todo lo que rodea a la palabra que no conocemos dentro del texto, dándonos pistas de su significado.', correct: true },
                { text: 'B) A cerrar el libro y dejar de leer.', correct: false },
                { text: 'C) Solamente a la portada del cuaderno.', correct: false }
            ]
        },
        {
            id: 'len_familia',
            name: 'Árbol Raíz: Familia de Palabras',
            emoji: '🌳',
            zone: 'SEMANA 21 • VOCABULARIO',
            badge: 'MISMA RAÍZ',
            pos: { x: 12, y: 0, z: 6 },
            color: 0x16a34a,
            boxTitles: ['🌱 Palabra Primitiva (Raíz)', '🥖 Ejemplo del Pan', '🌸 Ejemplo de la Flor'],
            story: '¡Mira este gran Árbol de las Palabras! Una FAMILIA DE PALABRAS es un grupo de palabras que comparten una misma raíz (parte inicial) y tienen significados que se relacionan entre sí.',
            house: 'Todas nacen de una palabra principal y comparten letras al comienzo.',
            food: 'De la palabra PAN nacen: panadero, panadería, panera y empanada.',
            skill: 'De la palabra FLOR nacen: florería, florero, florecer y florista.',
            question: '¿Cuál de los siguientes grupos corresponde a una verdadera FAMILIA DE PALABRAS?',
            options: [
                { text: 'A) Mar, marino, marinero, marea.', correct: true },
                { text: 'B) Lápiz, cuaderno, mochila, goma.', correct: false },
                { text: 'C) Sol, calor, playa, verano.', correct: false }
            ]
        },
        {
            id: 'len_cuentos',
            name: 'Narradora Gabriela: Cuentos y Lecturas',
            emoji: '📖',
            zone: 'REPOSITORIO DE LECTURAS',
            badge: 'CUENTO VS RECETA',
            pos: { x: 0, y: 0, z: 24 },
            color: 0xe11d48,
            boxTitles: ['🏰 El Cuento', '🥤 Texto Instructivo', '🌟 Lecturas de 2° Básico'],
            story: '¡Qué alegría leer! En 2° Básico conocimos cuentos maravillosos como "Ratón de campo y ratón de ciudad", "La vaca mágica", "El calafate", "Un pingüino poco perfecto" y la historia de "Gabriela, la poeta viajera".',
            house: 'Un CUENTO es una narración literaria breve con personajes, ambiente, inicio, problema (desarrollo) y desenlace.',
            food: 'En cambio, "Smoothie de melón (Ingredientes para cuatro)" NO es un cuento: ¡es una receta (texto instructivo)!',
            skill: 'Distinguir el tipo de texto nos ayuda a comprender su propósito desde el primer momento.',
            question: 'Si tienes dos textos: "Ratón de campo y ratón de ciudad" y "Smoothie de melón (Ingredientes para cuatro)", ¿cuál corresponde a un CUENTO?',
            options: [
                { text: 'A) "Ratón de campo y ratón de ciudad", porque narra una historia con personajes.', correct: true },
                { text: 'B) "Smoothie de melón", porque tiene lista de ingredientes.', correct: false },
                { text: 'C) Ninguno de los dos.', correct: false }
            ]
        }
    ],

    // ================= MUNDO 4: MATEMÁTICAS =================
    matematicas: [
        {
            id: 'mat_decenas',
            name: 'Profesor Número: Decenas y Unidades',
            emoji: '🔢',
            zone: 'UNIDAD 1 • SISTEMA DECIMAL',
            badge: 'DECENAS (10)',
            pos: { x: -12, y: 0, z: -16 },
            color: 0x0284c7,
            boxTitles: ['🔟 1 Decena = 10', '🧩 Barras Azules', '⭐ Unidades Amarillas'],
            story: '¡Bienvenido al Templo de las Matemáticas! En 2° Básico aprendemos que 10 unidades sueltas se juntan para formar 1 DECENA completa. ¡Mira las torres de bloques azules de 10 pisos!',
            house: 'Una barra o torre de 10 cubos representa 1 Decena. Los cubos sueltos son Unidades.',
            food: 'Si tenemos 5 decenas y 3 unidades, formamos el número 53.',
            skill: 'Podemos contar de 2 en 2, de 5 en 5 y de 10 en 10 para sumar a gran velocidad.',
            question: '¿Cuántas unidades forman exactamente 1 Decena, y qué número forman 4 Decenas y 7 Unidades?',
            options: [
                { text: 'A) 10 unidades forman 1 decena, y forman el número 47.', correct: true },
                { text: 'B) 100 unidades forman 1 decena, y forman el número 74.', correct: false },
                { text: 'C) 1 unidad forma 1 decena.', correct: false }
            ]
        },
        {
            id: 'mat_calculo',
            name: 'Cajera Ágil: Sumas y Restas',
            emoji: '🧮',
            zone: 'UNIDAD 2 • OPERACIONES',
            badge: 'CÁLCULO MENTAL',
            pos: { x: 12, y: 0, z: -16 },
            color: 0x16a34a,
            boxTitles: ['➕ Sumar = Agregar', '➖ Restar = Quitar', '⚡ Cálculo Mental'],
            story: '¡A calcular con rapidez! Sumar es juntar o agregar cantidades (símbolo +) y restar es quitar o buscar la diferencia (símbolo -). Resolver problemas cotidianos nos da súper poderes.',
            house: 'En la suma: 25 + 14 = 39 (sumamos unidades 5+4=9 y decenas 2+1=3).',
            food: 'En la resta: Si cosechamos 38 papas y cocinamos 12, quedan 26 papas.',
            skill: 'Hacer cálculo mental diario entrena el cerebro y nos hace ágiles como un lince.',
            question: 'En un puesto de feria escolar tienen 24 manzanas rojas y agregan 15 manzanas verdes. ¿Cuántas manzanas hay en total?',
            options: [
                { text: 'A) 39 manzanas.', correct: true },
                { text: 'B) 29 manzanas.', correct: false },
                { text: 'C) 9 manzanas.', correct: false }
            ]
        },
        {
            id: 'mat_geometria',
            name: 'Arquitecto Cubo: Cuerpos Geométricos 3D',
            emoji: '🧊',
            zone: 'UNIDAD 3 • GEOMETRÍA 3D',
            badge: 'FIGURAS Y CUERPOS',
            pos: { x: 0, y: 0, z: 16 },
            color: 0xf97316,
            boxTitles: ['📦 Cubo y Caras', '🔺 Pirámide', '⚽ Esfera'],
            story: '¡Explora el espacio tridimensional! Los cuerpos geométricos 3D tienen volumen: alto, ancho y largo. Un bloque de Minecraft o un dado es un CUBO con 6 caras cuadradas idénticas.',
            house: 'El CUBO tiene 6 caras cuadradas planas, 8 vértices (esquinas) y 12 aristas (bordes).',
            food: 'La PIRÁMIDE tiene caras triangulares que suben hasta una cúspide.',
            skill: 'La ESFERA no tiene esquinas y puede rodar fácilmente en cualquier dirección.',
            question: '¿Cuántas caras planas tiene un CUBO geométrico como los bloques de ColegioCraft?',
            options: [
                { text: 'A) 6 caras cuadradas.', correct: true },
                { text: 'B) 2 caras.', correct: false },
                { text: 'C) Ninguna cara.', correct: false }
            ]
        }
    ]
};

// Catálogo de 17 Mini-Juegos por Asignatura y Unidad
export const UNIT_MINIGAMES = {
    // ---------------- HISTORIA (6 MINI-JUEGOS) ----------------
    hist_aymara: {
        stationId: 'hist_aymara',
        subject: 'historia',
        title: 'El Intruso del Altiplano (Aymara)',
        mechanicName: '🕵️ El Intruso (Odd One Out)',
        emoji: '🦙',
        instructions: 'Observa los 4 elementos y toca cuál es el INTRUSO que NO corresponde al pueblo sedentario Aymara del Altiplano.',
        type: 'odd_one_out',
        rounds: [
            {
                prompt: 'Ronda 1: ¿Cuál de estos elementos NO pertenece a la vida Aymara en el Altiplano?',
                items: [
                    { emoji: '🏠', label: 'Casa Uta sin ventanas', isIntruder: false },
                    { emoji: '🦙', label: 'Crianza de llamas y alpacas', isIntruder: false },
                    { emoji: '🥔', label: 'Cultivo de papas y quinoa', isIntruder: false },
                    { emoji: '🛶', label: 'Canoa en glaciares del sur', isIntruder: true, reason: '¡Exacto! Las canoas en glaciares eran de los pueblos canoeros del extremo sur, no del Altiplano Aymara.' }
                ]
            },
            {
                prompt: 'Ronda 2: ¿Qué material es el INTRUSO en la construcción de la casa Uta Aymara?',
                items: [
                    { emoji: '🪨', label: 'Piedra firme', isIntruder: false },
                    { emoji: '🧱', label: 'Barro / Adobe', isIntruder: false },
                    { emoji: '🌾', label: 'Techo de paja', isIntruder: false },
                    { emoji: '🐳', label: 'Costillas de ballena', isIntruder: true, reason: '¡Muy bien! Las costillas de ballena las usaban los Changos en la costa, no los Aymaras.' }
                ]
            },
            {
                prompt: 'Ronda 3: ¿Cuál de estos pueblos es el INTRUSO si buscamos solo pueblos SEDENTARIOS?',
                items: [
                    { emoji: '🦙', label: 'Pueblo Aymara', isIntruder: false },
                    { emoji: '🏺', label: 'Pueblo Diaguita', isIntruder: false },
                    { emoji: '🌲', label: 'Pueblo Mapuche', isIntruder: false },
                    { emoji: '🦭', label: 'Pueblo Chango', isIntruder: true, reason: '¡Seco! El pueblo Chango era nómada del mar, mientras los otros tres eran sedentarios.' }
                ]
            }
        ]
    },
    hist_lickanantay: {
        stationId: 'hist_lickanantay',
        subject: 'historia',
        title: 'Memorice de Atacama y Valles (Lickanantay y Diaguita)',
        mechanicName: '🃏 Memorice (Encontrar Pares)',
        emoji: '🏺',
        instructions: 'Da vuelta las tarjetas ocultas para encontrar las 4 parejas de tesoros de los pueblos Lickanantay y Diaguita.',
        type: 'memory_pairs',
        pairs: [
            { id: 'agua', emoji: '💧', text: 'Agua del Oasis' },
            { id: 'jarro', emoji: '🏺', text: 'Jarro Diaguita' },
            { id: 'maiz', emoji: '🌽', text: 'Cultivo de Maíz' },
            { id: 'piedra', emoji: '🪨', text: 'Casa de Piedra' }
        ]
    },
    hist_chango: {
        stationId: 'hist_chango',
        subject: 'historia',
        title: '¿Dónde quedó la Balsa Chango?',
        mechanicName: '🐚 ¿Dónde quedó? (Toldos Costeros)',
        emoji: '🦭',
        instructions: 'Observa en qué toldo costero se esconde la Balsa de cuero de lobo marino, sigue el movimiento cuando se mezclen y descúbrela.',
        type: 'shell_game',
        prizeEmoji: '🦭',
        prizeName: 'Balsa de Lobo Marino Chango',
        fact: '¡Encontraste la balsa Chango! Recuerda que los Changos eran nómadas del mar y hacían sus toldos con costillas de ballena y cuero de lobo marino.'
    },
    hist_mapuche: {
        stationId: 'hist_mapuche',
        subject: 'historia',
        title: 'Completa la Oración Mapuche',
        mechanicName: '✏️ Completa la Oración',
        emoji: '🌲',
        instructions: 'Elige la palabra correcta que falta para darle sentido a cada oración sobre el pueblo Mapuche.',
        type: 'fill_blank',
        sentences: [
            {
                before: '1. El nombre Mapuche significa "Gente de la tierra" y su idioma tradicional es el',
                after: '.',
                options: ['mapuzugun', 'inglés', 'latín'],
                answer: 'mapuzugun'
            },
            {
                before: '2. Los Mapuches vivían en casas grandes y firmes de madera y paja llamadas',
                after: 'con un fogón al centro.',
                options: ['Ruka', 'Uta', 'Dalca'],
                answer: 'Ruka'
            },
            {
                before: '3. En los bosques del sur recolectaban el fruto de la araucaria llamado',
                after: 'y celebraban el Wiñol Txipantu.',
                options: ['piñón', 'coco', 'plátano'],
                answer: 'piñón'
            }
        ]
    },
    hist_chono_yagan: {
        stationId: 'hist_chono_yagan',
        subject: 'historia',
        title: 'Laberinto con Llave: Fuego en la Dalca',
        mechanicName: '🗝️ Laberinto con Llaves',
        emoji: '🛶',
        instructions: 'Guía la Dalca Chono (🛶) con las flechas hasta el Fuego Sagrado (🔥) para abrigarte del frío y luego navega hasta la Isla Austral (🏝️) evitando los témpanos (🧊).',
        type: 'maze_key'
    },
    hist_selknam_legado: {
        stationId: 'hist_selknam_legado',
        subject: 'historia',
        title: 'Anagramas: Nuestro Legado Indígena',
        mechanicName: '🔤 Anagramas (Ordena la Palabra)',
        emoji: '🏹',
        instructions: 'Toca las letras desordenadas en el orden correcto para formar las palabras heredadas de los pueblos originarios.',
        type: 'anagram',
        words: [
            { word: 'CONDOR', hint: '🦅 Ave gigante de los Andes cuyo nombre heredamos de los pueblos originarios.', emoji: '🦅' },
            { word: 'GUAGUA', hint: '👶 Palabra de origen indígena que usamos en Chile para decir "bebé".', emoji: '👶' },
            { word: 'PUMA', hint: '🐆 Felino salvaje chileno cuyo nombre proviene de los pueblos andinos.', emoji: '🐆' },
            { word: 'HAIN', hint: '🎭 Ceremonia Selk\'nam donde pintaban sus cuerpos junto a sus chozas en forma de cono.', emoji: '⛺' }
        ]
    },

    // ---------------- CIENCIAS NATURALES (6 MINI-JUEGOS) ----------------
    cie_corazon: {
        stationId: 'cie_corazon',
        subject: 'ciencias',
        title: 'Conecta Pares: El Equipo del Cuerpo Humano',
        mechanicName: '🔗 Conecta Pares (Unir Órgano y Función)',
        emoji: '❤️',
        instructions: 'Primero toca un órgano de la columna izquierda y luego toca su función correcta en la columna derecha para conectarlos.',
        type: 'match_columns',
        pairs: [
            { left: '❤️ Corazón', right: 'Bombea sangre a todo el cuerpo (70 lpm)' },
            { left: '🫁 Pulmones', right: 'Permiten respirar el aire en el tórax' },
            { left: '🍽️ Estómago', right: 'Fábrica que digiere y mezcla los alimentos' },
            { left: '🦴 Esqueleto y Músculos', right: 'Aparato locomotor que nos sostiene y mueve' }
        ]
    },
    cie_ejercicio: {
        stationId: 'cie_ejercicio',
        subject: 'ciencias',
        title: 'Simón Dice: ¡60 Minutos de Ejercicio!',
        mechanicName: '🔔 Simón Dice (Secuencia de Memoria)',
        emoji: '🏃',
        instructions: 'Observa el orden en que se iluminan los deportes saludables y repítelo tocando los botones en la misma secuencia.',
        type: 'simon_says'
    },
    cie_vertebrados: {
        stationId: 'cie_vertebrados',
        subject: 'ciencias',
        title: 'Sudoku Visual 4x4 de Vertebrados',
        mechanicName: '🧩 Sudoku Visual (4x4)',
        emoji: '🐸',
        instructions: 'Completa las casillas vacías con 🐟 Pez, 🐸 Rana, 🦎 Reptil o 🦅 Ave sin que se repita el mismo animal en la misma fila ni columna.',
        type: 'sudoku_4x4'
    },
    cie_invertebrados: {
        stationId: 'cie_invertebrados',
        subject: 'ciencias',
        title: 'Clasificador Rápido: ¿Insecto (6 patas) o Arácnido (8 patas)?',
        mechanicName: '⚡ Clasificador Rápido',
        emoji: '🦋',
        instructions: 'Clasifica cada artrópodo invertebrado en su contenedor correcto fijándote en su cantidad de patas articuladas y antenas.',
        type: 'fast_classifier',
        bins: [
            { label: '🦋 INSECTO (6 patas y antenas)', value: 'Insecto', color: 'bg-emerald-600 hover:bg-emerald-500' },
            { label: '🕷️ ARÁCNIDO (8 patas, sin antenas)', value: 'Arácnido', color: 'bg-purple-600 hover:bg-purple-500' }
        ],
        items: [
            { emoji: '🦋', name: 'Mariposa colorida', desc: 'Tiene 6 patas articuladas, 2 antenas y alas.', answer: 'Insecto' },
            { emoji: '🕷️', name: 'Araña de jardín', desc: 'Tiene 8 patas articuladas y no tiene antenas ni alas.', answer: 'Arácnido' },
            { emoji: '🐝', name: 'Abeja obrera', desc: 'Tiene 6 patas, 2 antenas y vuela de flor en flor.', answer: 'Insecto' },
            { emoji: '🦂', name: 'Escorpión / Alacrán', desc: 'Pariente de las arañas con 8 patas articuladas.', answer: 'Arácnido' },
            { emoji: '🐞', name: 'Chinita (Mariquita)', desc: 'Pequeño invertebrado con 6 patas articuladas y antenas.', answer: 'Insecto' }
        ]
    },
    cie_ciclos: {
        stationId: 'cie_ciclos',
        subject: 'ciencias',
        title: 'Ordena la Secuencia: Metamorfosis de la Mariposa',
        mechanicName: '🔢 Ordena la Historia (Secuencia 1 al 4)',
        emoji: '🌱',
        instructions: 'Toca las tarjetas en orden cronológico desde la etapa 1 hasta la etapa 4 del ciclo de vida de la mariposa.',
        type: 'sequence_order',
        steps: [
            { order: 1, emoji: '🥚', title: 'Huevo sobre una hoja' },
            { order: 2, emoji: '🐛', title: 'Larva u Oruga que come hojas' },
            { order: 3, emoji: '🫘', title: 'Pupa o Crisálida encerrada' },
            { order: 4, emoji: '🦋', title: 'Mariposa adulta con alas' }
        ]
    },
    cie_agua: {
        stationId: 'cie_agua',
        subject: 'ciencias',
        title: 'Verdadero o Falso contra el Reloj: El Agua',
        mechanicName: '⏱️ Verdadero o Falso contra el Reloj',
        emoji: '💧',
        instructions: 'Decide rápidamente si cada afirmación de las guías del Agua es VERDADERA o FALSA antes de que se acabe el tiempo.',
        type: 'true_false_timer',
        questions: [
            { text: 'El agua líquida es INCOLORA (transparente), INODORA (sin olor) e INSÍPIDA (sin sabor).', isTrue: true },
            { text: 'Cuando sube la temperatura y hace calor, el agua líquida se CONGELA en hielo.', isTrue: false },
            { text: 'El agua líquida ESCURRE y se adapta a la forma del recipiente que la contiene.', isTrue: true },
            { text: 'Si mezclamos sal o azúcar con agua y revolvemos, el agua las DISUELVE.', isTrue: true },
            { text: 'Cuando cuelgan la ropa mojada al sol, el agua se EVAPORA y pasa a estado gaseoso.', isTrue: true }
        ]
    },

    // ---------------- LENGUAJE Y COMUNICACIÓN (5 MINI-JUEGOS) ----------------
    len_comic: {
        stationId: 'len_comic',
        subject: 'lenguaje',
        title: 'Siluetas y Partes del Cómic de Garfield',
        mechanicName: '💭 Identifica la Silueta del Cómic',
        emoji: '💬',
        instructions: 'Observa cada silueta o elemento visual del cómic de la Semana 27 y elige cómo se llama.',
        type: 'comic_parts',
        challenges: [
            {
                visual: '💭 (Nube con circulitos sobre Garfield)',
                question: '¿Qué parte del cómic representa una silueta con forma de NUBE sobre la cabeza del personaje?',
                options: ['Globo de pensamiento', 'Receta de cocina', 'Noticia del diario'],
                answer: 'Globo de pensamiento'
            },
            {
                visual: '💬 "¡HOLA, GARFIELD!" (Con puntita hacia la boca)',
                question: '¿Cómo se llama el globo que indica lo que DICE el personaje hablando en voz alta?',
                options: ['Globo de diálogo', 'Pie de página', 'Índice'],
                answer: 'Globo de diálogo'
            },
            {
                visual: '💥 "¡CUIIC, CUIIC, CUIIC!" / "¡PLOP!"',
                question: '¿Cómo se llaman las palabras que imitan sonidos o ruidos dentro de una viñeta del cómic?',
                options: ['Onomatopeyas', 'Ingredientes', 'Ecuaciones'],
                answer: 'Onomatopeyas'
            }
        ]
    },
    len_localizar: {
        stationId: 'len_localizar',
        subject: 'lenguaje',
        title: 'Sopa de Letras con Pistas Visuales: Detective Lector',
        mechanicName: '🔍 Sopa de Letras Visual',
        emoji: '🔍',
        instructions: 'Encuentra y toca las 4 palabras clave para Localizar Información escondidas en las filas de la cuadrícula.',
        type: 'word_search',
        targets: [
            { word: 'LEER', hint: '📖 Paso 1: Mirar y comprender el texto' },
            { word: 'LUPA', hint: '🔍 Herramienta de detective para buscar pistas' },
            { word: 'SIMBA', hint: '🦁 Personaje del video de la Clase 1 que quería ser valiente' },
            { word: 'TEXTO', hint: '📄 Lugar donde está escrita la información explícita' }
        ],
        gridRows: [
            ['L', 'E', 'E', 'R', 'M', 'P'],
            ['A', 'L', 'U', 'P', 'A', 'O'],
            ['S', 'I', 'M', 'B', 'A', 'R'],
            ['T', 'E', 'X', 'T', 'O', 'S']
        ]
    },
    len_vocabulario: {
        stationId: 'len_vocabulario',
        subject: 'lenguaje',
        title: 'El Ahorcado: Adivina por el Contexto',
        mechanicName: '🎯 El Ahorcado (Vocabulario Contextual)',
        emoji: '🧩',
        instructions: 'Lee la pista del texto y toca las letras del abecedario para descubrir la palabra oculta usando su contexto.',
        type: 'hangman',
        words: [
            {
                word: 'ORO',
                context: 'La profesora dijo: "¡Vamos más rápido que el tiempo es ___!" (Significa que el tiempo es muy valioso).'
            },
            {
                word: 'CONTEXTO',
                context: 'Es todo lo que rodea a una palabra desconocida en el texto y nos da pistas de su significado.'
            },
            {
                word: 'VALIENTE',
                context: 'En el video de la clase, el pequeño león Simba trataba de ser muy ___ frente al peligro.'
            }
        ]
    },
    len_familia: {
        stationId: 'len_familia',
        subject: 'lenguaje',
        title: 'Caza de Palabras: Globos de la Familia de "PAN"',
        mechanicName: '🎈 Caza de Palabras en Globos',
        emoji: '🌳',
        instructions: '¡Toca y revienta SOLO los 4 globos que pertenecen a la FAMILIA DE PALABRAS de "PAN" (misma raíz)! Evita los globos intrusos.',
        type: 'balloon_hunt',
        rootWord: 'PAN',
        balloons: [
            { text: '🥖 PANADERO', isFamily: true },
            { text: '🏪 PANADERÍA', isFamily: true },
            { text: '🧺 PANERA', isFamily: true },
            { text: '🥟 EMPANADA', isFamily: true },
            { text: '🚗 AUTO', isFamily: false },
            { text: '✏️ LÁPIZ', isFamily: false },
            { text: '👟 ZAPATO', isFamily: false }
        ]
    },
    len_cuentos: {
        stationId: 'len_cuentos',
        subject: 'lenguaje',
        title: 'Crucigrama Infantil de Textos Literarios',
        mechanicName: '🔠 Crucigrama Infantil Ilustrado',
        emoji: '📖',
        instructions: 'Completa las 3 filas del crucigrama infantil eligiendo la palabra correcta según su pista e imagen.',
        type: 'mini_crossword',
        rows: [
            { clue: '1. 🏰 Narración literaria breve con inicio, desarrollo y desenlace (ej: "Ratón de campo y ratón de ciudad").', answer: 'CUENTO', options: ['CUENTO', 'RECETA', 'BOLETA'] },
            { clue: '2. ⚡ Relato fantástico con seres divinos que explica el origen del mundo o un fenómeno natural (Clase 65).', answer: 'MITO', options: ['MITO', 'AVISO', 'LISTA'] },
            { clue: '3. 💬 Texto literario que cuenta una historia en viñetas mezclando imágenes y globos de diálogo.', answer: 'COMIC', options: ['COMIC', 'CARTA', 'MAPA'] }
        ]
    }
};

// Preguntas tipo prueba por Asignatura
export const QUIZ_SETS = {
    historia: [
        {
            q: '1. ¿Quiénes fueron los primeros habitantes de lo que hoy conocemos como Chile, antes de la llegada de los españoles?',
            options: ['A) Los pueblos organizados.', 'B) Los pueblos originarios.', 'C) Los pueblos exploradores.'],
            correct: 1,
            explanation: '¡Exacto! Los pueblos originarios fueron los primeros habitantes del actual territorio chileno.'
        },
        {
            q: '2. Un estudiante observa el mapa de Chile y dice: "El norte es muy diferente al extremo sur". ¿Qué consecuencia tuvo esto para los pueblos originarios?',
            options: [
                'A) Todos vivían de la misma manera.',
                'B) Los pueblos originarios debieron adaptarse a los distintos paisajes, climas y recursos de cada zona.',
                'C) Todos habitaban en una sola zona.'
            ],
            correct: 1,
            explanation: '¡Muy bien! Cada pueblo adaptó su vivienda, ropa y alimentación al paisaje donde vivía.'
        },
        {
            q: '3. Los pueblos NÓMADAS se trasladaban de un lugar a otro para... y los SEDENTARIOS se establecían en un lugar para...',
            options: [
                'A) Nómadas para buscar comida (cazar, pescar, recolectar); Sedentarios para cultivar su propia comida y criar animales.',
                'B) Nómadas para construir edificios; Sedentarios para navegar en dalcas.',
                'C) Ambos hacían exactamente lo mismo.'
            ],
            correct: 0,
            explanation: '¡Seco! Ese es exactamente el Ticket de Salida de tu guía de Historia.'
        },
        {
            q: '4. ¿Qué pueblos habitaron la Zona Norte de Chile y cómo eran sus viviendas?',
            options: [
                'A) Aymara (Uta sin ventanas de piedra y barro), Lickanantay, Diaguita y Chango (toldos con costillas de ballena y cuero de lobo marino).',
                'B) Selk\'nam, Yagán y Kawésqar.',
                'C) Solamente inmigrantes alemanes.'
            ],
            correct: 0,
            explanation: '¡Excelente! Recordaste el plano de "¡Arquitectos del pasado!" de la Zona Norte.'
        },
        {
            q: '5. ¿Por qué seguimos estudiando a los pueblos originarios de Chile en la actualidad?',
            options: [
                'A) Porque fueron los primeros habitantes y sus aportes (alimentos como papa y maíz, palabras como guagua y puma, tejidos y respeto por la naturaleza) siguen presentes hoy.',
                'B) Porque construyeron ciudades modernas como Santiago.',
                'C) Porque llegaron después de los españoles.'
            ],
            correct: 0,
            explanation: '¡Súper bien! Muchos pueblos originarios continúan presentes hoy y son parte de nuestra identidad.'
        }
    ],
    ciencias: [
        {
            q: '1. ¿Cuál es la función básica del corazón y qué estructura interna nos permite mantenernos erguidos sin desplomarnos?',
            options: [
                'A) El corazón bombea sangre a todo el cuerpo, y el esqueleto (huesos) nos mantiene firmes y erguidos.',
                'B) El corazón digiere la comida y el estómago sostiene los huesos.',
                'C) Los pulmones bombean sangre.'
            ],
            correct: 0,
            explanation: '¡Correcto! El corazón bombea sangre (~70 veces por minuto) y el esqueleto sostiene nuestro cuerpo.'
        },
        {
            q: '2. ¿Qué ocurre en nuestro cuerpo cuando hacemos ejercicio y cuánto tiempo se recomienda al día?',
            options: [
                'A) El corazón late más rápido, respiramos más deprisa y fortalecemos huesos y músculos; se recomiendan 60 minutos al día.',
                'B) El corazón se detiene y nos quedamos sin energía para siempre.',
                'C) Es mejor pasar todo el día sentado frente al televisor.'
            ],
            correct: 0,
            explanation: '¡Buenísima! Hacer 60 minutos de actividad física al día mantiene sano nuestro corazón y músculos.'
        },
        {
            q: '3. ¿Cuáles son las principales características de los ANFIBIOS (como la rana) y los PECES?',
            options: [
                'A) Los anfibios tienen piel desnuda y húmeda y pasan por metamorfosis; los peces tienen escamas y respiran por branquias.',
                'B) Los anfibios tienen plumas y los peces tienen pelos.',
                'C) Ambos son animales invertebrados sin huesos.'
            ],
            correct: 0,
            explanation: '¡Exacto! El renacuajo vive en el agua con branquias y al convertirse en rana desarrolla pulmones.'
        },
        {
            q: '4. ¿Por qué los insectos (6 patas) y las arañas (8 patas) se agrupan como ARTRÓPODOS dentro de los invertebrados?',
            options: [
                'A) Porque no tienen columna vertebral y sus patas tienen articulaciones que se doblan en partes como nuestros dedos.',
                'B) Porque tienen huesos muy largos.',
                'C) Porque viven únicamente debajo del hielo.'
            ],
            correct: 0,
            explanation: '¡Genial! Artrópodo significa "patas articuladas", y los clasificamos también por su cantidad de patas.'
        },
        {
            q: '5. Según los experimentos del agua en la Unidad 3, ¿qué propiedades tiene el agua líquida?',
            options: [
                'A) Escurre, se adapta a la forma del recipiente, disuelve algunos sólidos (como azúcar y sal) y al calentarse se evapora.',
                'B) Se queda quieta en la mesa como un lápiz y disuelve piedras.',
                'C) Al ponerse en el congelador toda la noche se convierte en vapor caliente.'
            ],
            correct: 0,
            explanation: '¡Seco para las Ciencias! El agua escurre, toma la forma del envase y tiene poder disolvente.'
        }
    ],
    lenguaje: [
        {
            q: '1. ¿A qué grupo de textos pertenece el CÓMIC y cuáles son sus características?',
            options: [
                'A) Pertenece a los Textos Literarios; cuenta una historia en orden cronológico (inicio, desarrollo y desenlace) mezclando imágenes y texto.',
                'B) Pertenece a los Textos No Literarios como las noticias.',
                'C) No tiene imágenes ni viñetas.'
            ],
            correct: 0,
            explanation: '¡Muy bien! Así aparece en tu guía de la Semana 27 sobre el Cómic.'
        },
        {
            q: '2. ¿Qué es la INFORMACIÓN EXPLÍCITA en un texto?',
            options: [
                'A) Información oculta que no aparece escrita.',
                'B) Información que está a simple vista en el texto y sólo debes encontrar y subrayar.',
                'C) Información que inventamos sin leer.'
            ],
            correct: 1,
            explanation: '¡Exacto! La información explícita está escrita directamente en el texto.'
        },
        {
            q: '3. ¿Cuáles son los 4 pasos en orden para LOCALIZAR INFORMACIÓN en un texto?',
            options: [
                'A) 1. Leer el texto, 2. Leer la pregunta, 3. Buscar y subrayar la información en el texto, 4. Responder.',
                'B) 1. Responder al azar, 2. Cerrar el cuaderno.',
                'C) 1. Leer solo el título y adivinar.'
            ],
            correct: 0,
            explanation: '¡Perfecto! Esos son los 4 pasos del esquema de tu cuaderno de Lenguaje.'
        },
        {
            q: '4. ¿Qué es el CONTEXTO cuando aplicamos el vocabulario contextual?',
            options: [
                'A) Todo lo que rodea a la palabra que no conocemos en el texto y que nos da pistas de su significado.',
                'B) El número de página del libro.',
                'C) Una lista de números.'
            ],
            correct: 0,
            explanation: '¡Súper! El contexto rodea a la palabra difícil y nos permite inferir qué significa.'
        },
        {
            q: '5. ¿Qué tienen en común las palabras de una misma FAMILIA DE PALABRAS (como flor, florería, florero)?',
            options: [
                'A) Comparten la misma raíz (palabra primitiva) y sus significados están relacionados.',
                'B) No se parecen en nada.',
                'C) Todas significan animales.'
            ],
            correct: 0,
            explanation: '¡Excelente! Comparten la raíz y se relacionan en su significado.'
        }
    ],
    matematicas: [
        {
            q: '1. ¿Cuántas unidades forman 1 Decena y qué número se forma con 6 Decenas y 8 Unidades?',
            options: [
                'A) 1 Decena son 10 unidades, y se forma el número 68.',
                'B) 1 Decena son 100 unidades, y se forma el número 86.',
                'C) Se forma el número 14.'
            ],
            correct: 0,
            explanation: '¡Muy bien! 6 decenas (60) + 8 unidades = 68.'
        },
        {
            q: '2. Si cuentas de 5 en 5 hacia adelante empezando en 15: 15, 20, 25... ¿qué número viene después?',
            options: [
                'A) 30',
                'B) 26',
                'C) 35'
            ],
            correct: 0,
            explanation: '¡Exacto! 25 + 5 = 30.'
        },
        {
            q: '3. En el huerto Aymara cosecharon 38 papas y usaron 12 papas para cocinar. ¿Cuántas papas quedaron?',
            options: [
                'A) Quedaron 26 papas.',
                'B) Quedaron 50 papas.',
                'C) Quedaron 16 papas.'
            ],
            correct: 0,
            explanation: '¡Seco! Al quitar hacemos una resta: 38 - 12 = 26.'
        },
        {
            q: '4. ¿Cuál de los siguientes cuerpos geométricos 3D tiene exactamente 6 caras planas cuadradas idénticas?',
            options: [
                'A) El Cubo.',
                'B) La Esfera.',
                'C) El Cono.'
            ],
            correct: 0,
            explanation: '¡Excelente! El cubo tiene 6 caras cuadradas idénticas.'
        }
    ]
};

// Bloques de construcción estilo Minecraft / Voxel Estilizado
export const VOXEL_BLOCKS = [
    { id: 'stone', name: '🪨 Piedra y Adobe', desc: 'Material firme para construir casas y caminos', color: 0xa8a29e, roughness: 0.75 },
    { id: 'grass', name: '🌿 Césped Natural', desc: 'Pasto fresco y vida para huertos y praderas', color: 0x22c55e, roughness: 0.65 },
    { id: 'water', name: '💧 Bloque de Agua', desc: 'Agua cristalina que escurre y disuelve', color: 0x38bdf8, roughness: 0.2, opacity: 0.85 },
    { id: 'vital', name: '❤️ Bloque Vital', desc: 'Energía activa del corazón y la salud', color: 0xe11d48, roughness: 0.5, emissive: 0x330005 },
    { id: 'book', name: '📖 Bloque de Letras', desc: 'Páginas mágicas de viñetas, cómics y cuentos', color: 0xc026d3, roughness: 0.6 },
    { id: 'light', name: '✨ Bloque Dorado', desc: 'Luz radiante de sabiduría y fuego protector', color: 0xfacc15, roughness: 0.35, emissive: 0x443300 }
];

export const SUBJECT_QUIZZES = QUIZ_SETS;
