const textureLoader = new THREE.TextureLoader();

// Banco de dados expandido com o Sol e descrições detalhadas
const celestialData = {
    sun: { name: "Sol", type: "Estrela (Anã Amarela)", radius: 7, dist: 0, speed: 0, color: 0xffdd00, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg', data: { distSol: "0 km", size: "1.392.700 km", moons: "Os 8 planetas", atm: "Hidrogênio e Hélio (Plasma)", temp: "5.500°C (Superfície) / 15.000.000°C (Núcleo)", fact: "O Sol contém 99,86% de toda a massa do Sistema Solar. A energia gerada em seu núcleo via fusão nuclear leva cerca de 100 mil anos para chegar à superfície e virar luz." } },
    mercury: { name: "Mercúrio", type: "Planeta Rochoso", radius: 1.2, dist: 18, speed: 0.04, color: 0x888888, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/moon_1024.jpg', data: { distSol: "57,9 milhões km", size: "4.879 km", moons: "0", atm: "Exosfera tênue (Oxigênio, Sódio)", temp: "-173°C a 427°C", fact: "Apesar de ser o mais próximo do Sol, não é o mais quente. A falta de atmosfera impede a retenção de calor à noite." } },
    venus: { name: "Vênus", type: "Planeta Rochoso", radius: 2.2, dist: 26, speed: 0.015, color: 0xe3bb76, textureUrl: null, data: { distSol: "108,2 milhões km", size: "12.104 km", moons: "0", atm: "Altamente densa (CO2, Ácido Sulfúrico)", temp: "464°C", fact: "O efeito estufa descontrolado faz de Vênus o planeta mais quente do sistema solar." } },
    earth: { name: "Terra", type: "Planeta Rochoso", radius: 2.5, dist: 36, speed: 0.01, color: 0x2233ff, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg', hasMoon: true, hasISS: true, data: { distSol: "149,6 milhões km (1 UA)", size: "12.742 km", moons: "1 (Lua) + Satélites Artificiais", atm: "Nitrogênio (78%) e Oxigênio (21%)", temp: "15°C média", fact: "Do ponto de vista da física, a Terra é um excelente laboratório de fluidos, onde a gravidade retém uma camada exata de gases essenciais para a vida." } },
    mars: { name: "Marte", type: "Planeta Rochoso", radius: 1.6, dist: 46, speed: 0.008, color: 0xc1440e, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/mars_1k_color.jpg', data: { distSol: "227,9 milhões km", size: "6.779 km", moons: "2 (Fobos e Deimos)", atm: "Fina (Dióxido de Carbono)", temp: "-62°C", fact: "A coloração avermelhada se deve à oxidação do ferro (ferrugem) em sua superfície." } },
    jupiter: { name: "Júpiter", type: "Gigante Gasoso", radius: 5.5, dist: 64, speed: 0.002, color: 0xb07f35, textureUrl: null, hasMoon: true, data: { distSol: "778,5 milhões km", size: "139.820 km", moons: "95 conhecidas", atm: "Hidrogênio e Hélio", temp: "-108°C", fact: "Sua gravidade gigantesca atua como um 'escudo' para a Terra, atraindo e desviando cometas perigosos." } },
    saturn: { name: "Saturno", type: "Gigante Gasoso", radius: 4.5, dist: 84, speed: 0.0009, color: 0xe2bf7d, textureUrl: null, hasRings: true, hasMoon: true, data: { distSol: "1,4 bilhão km", size: "116.460 km", moons: "146 conhecidas", atm: "Hidrogênio e Hélio", temp: "-139°C", fact: "É o único planeta com densidade menor que a da água. Se houvesse um oceano gigante o suficiente, Saturno flutuaria nele." } },
    uranus: { name: "Urano", type: "Gigante de Gelo", radius: 3.2, dist: 104, speed: 0.0004, color: 0x71b2c9, textureUrl: null, data: { distSol: "2,9 bilhões km", size: "50.724 km", moons: "28", atm: "Hidrogênio, Hélio, Metano", temp: "-197°C", fact: "Urano gira 'deitado' com uma inclinação de 98 graus, o que resulta em estações do ano que duram 21 anos terrestres cada." } },
    neptune: { name: "Netuno", type: "Gigante de Gelo", radius: 3.1, dist: 120, speed: 0.0001, color: 0x274687, textureUrl: null, data: { distSol: "4,5 bilhões km", size: "49.244 km", moons: "16", atm: "Hidrogênio, Hélio, Metano", temp: "-201°C", fact: "O metano na atmosfera absorve a luz vermelha e reflete a luz azul, dando ao planeta sua cor característica." } }
};

let scene, camera, renderer, controls;
let planetsSystem = [];
let raycasterObjects = [];
let isPaused = false;

// Variáveis de controle de Foco da Câmera
let focusedPlanetMesh = null;
let previousTargetPos = new THREE.Vector3();
let targetCamPos = new THREE.Vector3();
let isLerpingCamera = false;

const infoPanel = document.getElementById('info-panel');
const container = document.getElementById('canvas-container');

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1500);
    camera.position.set(0, 70, 140);

    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxDistance = 600;
    controls.minDistance = 5; // Reduzido para permitir chegar bem perto do planeta

    // Iluminação
    scene.add(new THREE.AmbientLight(0x333333));
    const sunLight = new THREE.PointLight(0xffffff, 2, 400);
    scene.add(sunLight);

    // Renderizando os Corpos Celestes
    Object.keys(celestialData).forEach((key) => {
        const data = celestialData[key];

        if (key === 'sun') {
            const mat = new THREE.MeshBasicMaterial({ color: data.color });
            const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 32, 32), mat);
            sunMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius };
            scene.add(sunMesh);
            raycasterObjects.push(sunMesh);
            planetsSystem.push({ isSun: true, mesh: sunMesh });
            return;
        }

        const planetGroup = new THREE.Group();
        planetGroup.userData.currentAngle = Math.random() * Math.PI * 2;
        planetGroup.userData.speed = data.speed;
        planetGroup.userData.dist = data.dist;

        let pMat;
        if (data.textureUrl) {
            pMat = new THREE.MeshStandardMaterial({ map: textureLoader.load(data.textureUrl), roughness: 0.8 });
        } else {
            pMat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.7 });
        }
        
        const pMesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 32, 32), pMat);
        pMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius };
        raycasterObjects.push(pMesh);
        planetGroup.add(pMesh);

        if (data.hasRings) {
            const ringGeo = new THREE.RingGeometry(data.radius * 1.4, data.radius * 2.3, 64);
            const ringMat = new THREE.MeshStandardMaterial({ color: 0xbf9b65, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.rotation.x = Math.PI / 2.5;
            planetGroup.add(ringMesh);
        }

        let moonPivot;
        if (data.hasMoon) {
            moonPivot = new THREE.Group();
            const moonGeo = new THREE.SphereGeometry(0.5, 16, 16);
            const moonMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.9 });
            const moonMesh = new THREE.Mesh(moonGeo, moonMat);
            moonMesh.position.set(data.radius + 2, 0, 0);
            moonPivot.add(moonMesh);
            planetGroup.add(moonPivot);
        }

        let issPivot;
        if (data.hasISS) {
            issPivot = new THREE.Group();
            const issGeo = new THREE.BoxGeometry(0.4, 0.1, 0.3);
            const issMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
            const issMesh = new THREE.Mesh(issGeo, issMat);
            issMesh.position.set(data.radius + 0.8, 0, 0);
            issPivot.add(issMesh);
            planetGroup.add(issPivot);
        }

        createOrbitLine(data.dist);
        scene.add(planetGroup);
        planetsSystem.push({ isSun: false, group: planetGroup, pMesh: pMesh, moonPivot: moonPivot, issPivot: issPivot });
    });

    createStarfield();

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('click', onPlanetClick);
    setupUIControls();
}

function createOrbitLine(radius) {
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 });
    const points = [];
    for (let i = 0; i <= 128; i++) {
        const theta = (i / 128) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    scene.add(new THREE.Line(geometry, material));
}

function createStarfield() {
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
        const radius = 400 + Math.random() * 300;
        const u = Math.random(); const v = Math.random();
        const theta = u * 2.0 * Math.PI; const phi = Math.acos(2.0 * v - 1.0);
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i+1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i+2] = radius * Math.cos(phi);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    scene.add(new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, transparent: true, opacity: 0.8 })));
}

// Interatividade Avançada - Clique no Planeta
function onPlanetClick(event) {
    if (event.target.tagName === 'BUTTON' || event.target.closest('#info-panel') || event.target.closest('#physics-modal')) return;

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(raycasterObjects);

    if (intersects.length > 0) {
        const clickedPlanet = intersects[0].object;
        const info = clickedPlanet.userData;

        // Atualiza a Câmera para focar no planeta
        focusedPlanetMesh = clickedPlanet;
        focusedPlanetMesh.getWorldPosition(previousTargetPos);
        
        // Define o ângulo de aproximação ideal com base no tamanho do planeta
        const r = info.radius || 2;
        const offset = new THREE.Vector3(r * 2.5, r * 1.5, r * 4);
        
        targetCamPos.copy(previousTargetPos).add(offset);
        isLerpingCamera = true;
        controls.enabled = false; // Desativa o controle manual do mouse durante o voo da câmera

        // Atualiza Interface
        document.getElementById('planet-name').textContent = info.name;
        document.getElementById('planet-type').textContent = info.type;
        document.getElementById('planet-dist').textContent = info.distSol;
        document.getElementById('planet-size').textContent = info.size;
        document.getElementById('planet-moons').textContent = info.moons;
        document.getElementById('planet-atm').textContent = info.atm;
        document.getElementById('planet-temp').textContent = info.temp;
        document.getElementById('planet-fact').textContent = info.fact;

        infoPanel.classList.add('visible');
    }
}

// Loop de Física e Câmera
function animate() {
    requestAnimationFrame(animate);

    // Física: Atualiza a posição dos corpos celestes
    planetsSystem.forEach((sys) => {
        if (sys.isSun) {
            sys.mesh.rotation.y += 0.002;
        } else {
            sys.pMesh.rotation.y += 0.01;
            if (sys.moonPivot) sys.moonPivot.rotation.y += 0.03;
            if (sys.issPivot) {
                sys.issPivot.rotation.y += 0.08;
                sys.issPivot.rotation.x += 0.02;
            }
            if (!isPaused) {
                sys.group.userData.currentAngle += sys.group.userData.speed;
                sys.group.position.x = Math.cos(sys.group.userData.currentAngle) * sys.group.userData.dist;
                sys.group.position.z = Math.sin(sys.group.userData.currentAngle) * sys.group.userData.dist;
            }
        }
    });

    // Câmera: Sistema Dinâmico de Rastreamento (Tracking)
    if (focusedPlanetMesh) {
        const currentTargetPos = new THREE.Vector3();
        focusedPlanetMesh.getWorldPosition(currentTargetPos);

        // Calcula quanto o planeta se moveu neste exato quadro (Delta)
        const delta = new THREE.Vector3().subVectors(currentTargetPos, previousTargetPos);

        if (isLerpingCamera) {
            // Animação suave de aproximação "estilo cinema"
            targetCamPos.add(delta); 
            camera.position.lerp(targetCamPos, 0.05);
            controls.target.lerp(currentTargetPos, 0.05);

            // Quando chegar perto o suficiente, destrava o mouse
            if (camera.position.distanceTo(targetCamPos) < 0.5) {
                isLerpingCamera = false;
                controls.enabled = true;
            }
        } else {
            // Câmera atracada ao planeta: Viaja pelo espaço junto com ele
            camera.position.add(delta);
            controls.target.copy(currentTargetPos);
        }

        previousTargetPos.copy(currentTargetPos);
    } else {
        // Se nada estiver focado, retorna o alvo da câmera para o Sol suavemente
        controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
    }

    controls.update();
    renderer.render(scene, camera);
}

// Controles de UI
function setupUIControls() {
    document.getElementById('btn-pause').addEventListener('click', () => isPaused = !isPaused);
    document.getElementById('close-panel').addEventListener('click', () => {
        infoPanel.classList.remove('visible');
    });
    
    // Visão Global
    document.getElementById('btn-reset').addEventListener('click', () => {
        focusedPlanetMesh = null;
        isLerpingCamera = false;
        controls.enabled = true;
        camera.position.set(0, 70, 140);
        infoPanel.classList.remove('visible');
    });

    // Visão de Topo
    document.getElementById('btn-view').addEventListener('click', () => {
        focusedPlanetMesh = null; 
        isLerpingCamera = false;
        controls.enabled = true;
        camera.position.set(0, 180, 0.1);
        infoPanel.classList.remove('visible');
    });

    const modal = document.getElementById('physics-modal');
    document.getElementById('btn-physics').addEventListener('click', () => modal.classList.remove('hidden'));
    document.getElementById('close-physics').addEventListener('click', () => modal.classList.add('hidden'));
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate();