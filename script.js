const textureLoader = new THREE.TextureLoader();

// Banco de Dados Principal
const celestialData = {
    sun: { name: "Sol", type: "Estrela (Anã Amarela)", radius: 7, dist: 0, speed: 0, color: 0xffdd00, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg', data: { distSol: "0 km", size: "1.392.700 km", moons: "Os 8 planetas", atm: "Hidrogênio e Hélio (Plasma)", temp: "5.500°C (Superfície)", fact: "O Sol contém 99,86% de toda a massa do Sistema Solar." } },
    mercury: { name: "Mercúrio", type: "Planeta Rochoso", radius: 1.2, dist: 18, speed: 0.04, color: 0x888888, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/moon_1024.jpg', data: { distSol: "57,9 M km", size: "4.879 km", moons: "0", atm: "Exosfera tênue", temp: "-173°C a 427°C", fact: "Não possui atmosfera para reter o calor do Sol." } },
    venus: { name: "Vênus", type: "Planeta Rochoso", radius: 2.2, dist: 26, speed: 0.015, color: 0xe3bb76, textureUrl: null, data: { distSol: "108,2 M km", size: "12.104 km", moons: "0", atm: "Altamente densa (CO2)", temp: "464°C", fact: "É o planeta mais quente do sistema solar devido ao efeito estufa." } },
    earth: { name: "Terra", type: "Planeta Rochoso", radius: 2.5, dist: 36, speed: 0.01, color: 0x2233ff, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg', hasMoon: true, hasISS: true, data: { distSol: "149,6 M km", size: "12.742 km", moons: "1 (Lua) + Satélites", atm: "Nitrogênio e Oxigênio", temp: "15°C média", fact: "Único laboratório natural com água líquida em abundância." } },
    mars: { name: "Marte", type: "Planeta Rochoso", radius: 1.6, dist: 46, speed: 0.008, color: 0xc1440e, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/mars_1k_color.jpg', data: { distSol: "227,9 M km", size: "6.779 km", moons: "2", atm: "Fina (CO2)", temp: "-62°C", fact: "A cor vermelha vem da oxidação do ferro no solo." } },
    jupiter: { name: "Júpiter", type: "Gigante Gasoso", radius: 5.5, dist: 64, speed: 0.002, color: 0xb07f35, textureUrl: null, data: { distSol: "778,5 M km", size: "139.820 km", moons: "95", atm: "Hidrogênio e Hélio", temp: "-108°C", fact: "Sua gravidade gigantesca desvia cometas perigosos da Terra." } },
    saturn: { name: "Saturno", type: "Gigante Gasoso", radius: 4.5, dist: 84, speed: 0.0009, color: 0xe2bf7d, textureUrl: null, hasRings: true, data: { distSol: "1,4 B km", size: "116.460 km", moons: "146", atm: "Hidrogênio e Hélio", temp: "-139°C", fact: "Tem densidade menor que a da água; flutuaria em um oceano gigante." } },
    uranus: { name: "Urano", type: "Gigante de Gelo", radius: 3.2, dist: 104, speed: 0.0004, color: 0x71b2c9, textureUrl: null, data: { distSol: "2,9 B km", size: "50.724 km", moons: "28", atm: "Hidrogênio, Metano", temp: "-197°C", fact: "Gira quase totalmente 'deitado' sobre seu próprio eixo." } },
    neptune: { name: "Netuno", type: "Gigante de Gelo", radius: 3.1, dist: 120, speed: 0.0001, color: 0x274687, textureUrl: null, data: { distSol: "4,5 B km", size: "49.244 km", moons: "16", atm: "Hidrogênio, Metano", temp: "-201°C", fact: "Possui ventos supersônicos de até 2.100 km/h." } }
};

// Dados Específicos para Lua e ISS
const moonInfo = { name: "Lua", type: "Satélite Natural", distSol: "384.400 km da Terra", size: "3.474 km", moons: "0", atm: "Nenhuma", temp: "-173 a 127°C", fact: "Sua atração gravitacional causa as marés na Terra." };
const issInfo = { name: "ISS", type: "Estação Espacial", distSol: "400 km da superfície", size: "109 metros", moons: "0", atm: "Vácuo", temp: "Variável (-150 a 120°C)", fact: "Viaja a 28.000 km/h, completando uma órbita a cada 90 minutos." };

let scene, camera, renderer, controls;
let planetsSystem = [];
let raycasterObjects = [];
let isPaused = false;

// Controle de Rastreamento (Tracking)
let focusedPlanetMesh = null;
let previousTargetPos = new THREE.Vector3();
let targetCamPos = new THREE.Vector3();
let isLerpingCamera = false;

const infoPanel = document.getElementById('info-panel');
const container = document.getElementById('canvas-container');

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 70, 140);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Otimização mobile
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxDistance = 800;
    controls.minDistance = 2; // Permite zoom intenso nas minúsculas naves

    scene.add(new THREE.AmbientLight(0x333333));
    scene.add(new THREE.PointLight(0xffffff, 2, 400));

    // Geração do Universo
    Object.keys(celestialData).forEach((key) => {
        const data = celestialData[key];

        // Sol
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

        // Planeta Base
        let pMat = data.textureUrl 
            ? new THREE.MeshStandardMaterial({ map: textureLoader.load(data.textureUrl), roughness: 0.8 })
            : new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.7 });
        
        const pMesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 32, 32), pMat);
        pMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius };
        raycasterObjects.push(pMesh);
        planetGroup.add(pMesh);

        // Anéis
        if (data.hasRings) {
            const ringMat = new THREE.MeshStandardMaterial({ color: 0xbf9b65, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
            const ringMesh = new THREE.Mesh(new THREE.RingGeometry(data.radius * 1.4, data.radius * 2.3, 64), ringMat);
            ringMesh.rotation.x = Math.PI / 2.5;
            planetGroup.add(ringMesh);
        }

        // Sistema Lunar Avançado
        let moonPivot;
        if (data.hasMoon) {
            moonPivot = new THREE.Group();
            const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
            moonMesh.position.set(data.radius + 2.5, 0, 0);
            
            // Hitbox (Caixa invisível maior para facilitar o clique na tela do celular)
            const moonHitbox = new THREE.Mesh(new THREE.SphereGeometry(1.2, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
            moonHitbox.position.copy(moonMesh.position);
            moonHitbox.userData = { ...moonInfo, radius: 0.8 };
            
            moonPivot.add(moonMesh);
            moonPivot.add(moonHitbox);
            raycasterObjects.push(moonHitbox);
            planetGroup.add(moonPivot);
        }

        // Miniatura Detalhada da ISS
        let issPivot;
        if (data.hasISS) {
            issPivot = new THREE.Group();
            
            // Corpo Central (Cilindro)
            const core = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8), new THREE.MeshStandardMaterial({ color: 0xcccccc }));
            core.rotation.x = Math.PI / 2;
            issPivot.add(core);

            // Painéis Solares (Placas Azuis)
            const panelMat = new THREE.MeshStandardMaterial({ color: 0x1133aa, side: THREE.DoubleSide });
            const panelGeo = new THREE.BoxGeometry(0.5, 0.02, 0.15);
            const panel1 = new THREE.Mesh(panelGeo, panelMat); panel1.position.z = 0.15;
            const panel2 = new THREE.Mesh(panelGeo, panelMat); panel2.position.z = -0.15;
            issPivot.add(panel1); issPivot.add(panel2);

            issPivot.position.set(data.radius + 0.8, 0, 0);

            // Hitbox da ISS (Permite clicar facilmente nela)
            const issHitbox = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
            issHitbox.position.copy(issPivot.position);
            issHitbox.userData = { ...issInfo, radius: 0.4 }; // Radius pequeno força aproximação grande da câmera
            
            const issRotatorGroup = new THREE.Group(); // Grupo para girar a ISS ao redor da Terra
            issRotatorGroup.add(issPivot);
            issRotatorGroup.add(issHitbox);
            
            raycasterObjects.push(issHitbox);
            planetGroup.add(issRotatorGroup);
            
            // Passamos o RotatorGroup para animar depois
            issPivot = issRotatorGroup; 
        }

        createOrbitLine(data.dist);
        scene.add(planetGroup);
        planetsSystem.push({ isSun: false, group: planetGroup, pMesh: pMesh, moonPivot: moonPivot, issPivot: issPivot });
    });

    createStarfield();

    window.addEventListener('resize', onWindowResize);
    // Suporte Universal a Cliques e Toques (Pointer Events substitui touch e mouse)
    renderer.domElement.addEventListener('pointerup', onPlanetClick);
    setupUIControls();
}

function createOrbitLine(radius) {
    const points = [];
    for (let i = 0; i <= 128; i++) points.push(new THREE.Vector3(Math.cos(i/128 * Math.PI*2) * radius, 0, Math.sin(i/128 * Math.PI*2) * radius));
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08 })));
}

function createStarfield() {
    const pos = new Float32Array(2000 * 3);
    for (let i = 0; i < 6000; i += 3) {
        const r = 400 + Math.random() * 300, u = Math.random(), v = Math.random();
        const theta = u * 2 * Math.PI, phi = Math.acos(2 * v - 1);
        pos[i] = r * Math.sin(phi) * Math.cos(theta);
        pos[i+1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i+2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, transparent: true, opacity: 0.8 })));
}

// Lógica de Raycaster Melhorada (Suporta Toggle de Zoom)
function onPlanetClick(event) {
    if (event.target.tagName === 'BUTTON' || event.target.closest('#info-panel') || event.target.closest('#physics-modal')) return;

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(raycasterObjects);

    if (intersects.length > 0) {
        const clickedObj = intersects[0].object;

        // Se clicou no objeto que JÁ ESTÁ focado, ativa a visão geral (Zoom Out)
        if (focusedPlanetMesh === clickedObj) {
            resetCamera();
            return;
        }

        const info = clickedObj.userData;

        // Configura Rastreamento e Interpolação da Câmera
        focusedPlanetMesh = clickedObj;
        focusedPlanetMesh.getWorldPosition(previousTargetPos);
        
        const r = info.radius || 2;
        const offset = new THREE.Vector3(r * 2.5, r * 1.5, r * 3.5); 
        
        targetCamPos.copy(previousTargetPos).add(offset);
        isLerpingCamera = true;
        controls.enabled = false; 

        // Atualiza UI
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

// Função Limpa para resetar a visão de volta para o Sol
function resetCamera() {
    focusedPlanetMesh = null;
    isLerpingCamera = false;
    controls.enabled = true;
    camera.position.set(0, 70, 140);
    controls.target.set(0,0,0);
    infoPanel.classList.remove('visible');
}

function animate() {
    requestAnimationFrame(animate);

    planetsSystem.forEach((sys) => {
        if (sys.isSun) {
            sys.mesh.rotation.y += 0.002;
        } else {
            sys.pMesh.rotation.y += 0.01;
            if (sys.moonPivot) sys.moonPivot.rotation.y += 0.02;
            if (sys.issPivot) sys.issPivot.rotation.y += 0.05; // ISS orbita rápido ao redor da Terra

            if (!isPaused) {
                sys.group.userData.currentAngle += sys.group.userData.speed;
                sys.group.position.x = Math.cos(sys.group.userData.currentAngle) * sys.group.userData.dist;
                sys.group.position.z = Math.sin(sys.group.userData.currentAngle) * sys.group.userData.dist;
            }
        }
    });

    if (focusedPlanetMesh) {
        const currentTargetPos = new THREE.Vector3();
        focusedPlanetMesh.getWorldPosition(currentTargetPos);
        const delta = new THREE.Vector3().subVectors(currentTargetPos, previousTargetPos);

        if (isLerpingCamera) {
            targetCamPos.add(delta); 
            camera.position.lerp(targetCamPos, 0.08); // Aproximação mais rápida
            controls.target.lerp(currentTargetPos, 0.08);

            if (camera.position.distanceTo(targetCamPos) < 0.5) {
                isLerpingCamera = false;
                controls.enabled = true;
            }
        } else {
            camera.position.add(delta);
            controls.target.copy(currentTargetPos);
        }
        previousTargetPos.copy(currentTargetPos);
    }

    controls.update();
    renderer.render(scene, camera);
}

function setupUIControls() {
    document.getElementById('btn-pause').addEventListener('click', () => isPaused = !isPaused);
    document.getElementById('close-panel').addEventListener('click', () => infoPanel.classList.remove('visible'));
    
    document.getElementById('btn-reset').addEventListener('click', resetCamera);

    document.getElementById('btn-view').addEventListener('click', () => {
        resetCamera();
        camera.position.set(0, 180, 0.1);
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
