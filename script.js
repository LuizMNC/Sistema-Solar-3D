const textureLoader = new THREE.TextureLoader();

// --- BANCO DE DADOS CELESTE (Com Luas Famosas e ISS) ---
const issData = { id: 'iss', name: "Estação Espacial Internacional", type: "Estação Espacial", distSol: "Órbita Terrestre Baixa", size: "109 metros", atm: "Vácuo", temp: "Variável", fact: "A ISS é o maior objeto artificial no espaço." };

const celestialData = {
    sun: { name: "Sol", type: "Estrela", radius: 7, dist: 0, speed: 0, color: 0xffdd00, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg', data: { distSol: "0 km", size: "1.392.700 km", atm: "Plasma", temp: "5.500°C", fact: "O Sol contém 99,86% de toda a massa do Sistema Solar." } },
    mercury: { name: "Mercúrio", type: "Planeta Rochoso", radius: 1.2, dist: 16, speed: 0.04, color: 0x888888, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/moon_1024.jpg', data: { distSol: "57,9 M km", size: "4.879 km", atm: "Exosfera", temp: "-173°C a 427°C", fact: "Não possui luas." } },
    venus: { name: "Vênus", type: "Planeta Rochoso", radius: 2.2, dist: 23, speed: 0.015, color: 0xe3bb76, textureUrl: null, data: { distSol: "108,2 M km", size: "12.104 km", atm: "Altamente densa (CO2)", temp: "464°C", fact: "Planeta mais quente devido ao efeito estufa extremo." } },
    earth: { name: "Terra", type: "Planeta Rochoso", radius: 2.5, dist: 32, speed: 0.01, color: 0x2233ff, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg', hasISS: true, 
        moons: [ { id: 'moon', name: "Lua", radius: 0.6, dist: 3.5, speed: 0.03, color: 0xcccccc, data: { distSol: "384.400 km da Terra", size: "3.474 km", atm: "Nenhuma", temp: "-173 a 127°C", fact: "Principal responsável pelas marés." } } ],
        data: { distSol: "149,6 M km", size: "12.742 km", atm: "Nitrogênio e Oxigênio", temp: "15°C", fact: "Único com água líquida na superfície." } },
    mars: { name: "Marte", type: "Planeta Rochoso", radius: 1.6, dist: 42, speed: 0.008, color: 0xc1440e, textureUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/mars_1k_color.jpg', 
        moons: [ { id: 'phobos', name: "Fobos", radius: 0.3, dist: 2.2, speed: 0.05, color: 0x887766, data: { distSol: "Órbita marciana", size: "22 km", atm: "Nenhuma", temp: "-40°C", fact: "Fobos orbita Marte tão perto que está gradualmente caindo nele." } },
                 { id: 'deimos', name: "Deimos", radius: 0.25, dist: 3.0, speed: 0.03, color: 0x999999, data: { distSol: "Órbita marciana", size: "12 km", atm: "Nenhuma", temp: "-40°C", fact: "É uma das menores luas do Sistema Solar." } } ],
        data: { distSol: "227,9 M km", size: "6.779 km", atm: "Fina (CO2)", temp: "-62°C", fact: "Possui o maior vulcão do sistema solar, o Monte Olimpo." } },
    jupiter: { name: "Júpiter", type: "Gigante Gasoso", radius: 5.5, dist: 60, speed: 0.002, color: 0xb07f35, textureUrl: null, 
        moons: [ { id: 'io', name: "Io", radius: 0.4, dist: 6.5, speed: 0.06, color: 0xffffaa, data: { distSol: "Órbita jupiteriana", size: "3.642 km", atm: "Dióxido de Enxofre", temp: "-130°C", fact: "Corpo mais vulcanicamente ativo do Sistema Solar." } },
                 { id: 'europa', name: "Europa", radius: 0.38, dist: 7.5, speed: 0.04, color: 0xffffff, data: { distSol: "Órbita jupiteriana", size: "3.121 km", atm: "Oxigênio tênue", temp: "-160°C", fact: "Acredita-se ter um oceano de água líquida sob o gelo." } },
                 { id: 'ganymede', name: "Ganimedes", radius: 0.5, dist: 8.8, speed: 0.03, color: 0xcccccc, data: { distSol: "Órbita jupiteriana", size: "5.268 km", atm: "Oxigênio", temp: "-163°C", fact: "Maior lua do Sistema Solar (maior que Mercúrio)." } },
                 { id: 'callisto', name: "Calisto", radius: 0.48, dist: 10.2, speed: 0.02, color: 0x888888, data: { distSol: "Órbita jupiteriana", size: "4.820 km", atm: "Dióxido de Carbono", temp: "-139°C", fact: "Superfície mais antiga e craterizada conhecida." } } ],
        data: { distSol: "778,5 M km", size: "139.820 km", atm: "Hidrogênio e Hélio", temp: "-108°C", fact: "Massa 2,5 vezes maior que todos os outros planetas juntos." } },
    saturn: { name: "Saturno", type: "Gigante Gasoso", radius: 4.5, dist: 85, speed: 0.0009, color: 0xe2bf7d, textureUrl: null, hasRings: true, 
        moons: [ { id: 'titan', name: "Titã", radius: 0.5, dist: 7.5, speed: 0.02, color: 0xddaa55, data: { distSol: "Órbita saturniana", size: "5.149 km", atm: "Nitrogênio e Metano", temp: "-179°C", fact: "Única lua com nuvens densas e lagos de metano líquido." } },
                 { id: 'enceladus', name: "Encélado", radius: 0.3, dist: 6.0, speed: 0.04, color: 0xffffff, data: { distSol: "Órbita saturniana", size: "504 km", atm: "Vapor d'água", temp: "-198°C", fact: "Expele jatos de água no espaço, formando um dos anéis de Saturno." } } ],
        data: { distSol: "1,4 B km", size: "116.460 km", atm: "Hidrogênio e Hélio", temp: "-139°C", fact: "Sua densidade é tão baixa que flutuaria na água." } },
    uranus: { name: "Urano", type: "Gigante de Gelo", radius: 3.2, dist: 105, speed: 0.0004, color: 0x71b2c9, textureUrl: null, 
        moons: [ { id: 'titania', name: "Titânia", radius: 0.35, dist: 5.0, speed: 0.03, color: 0xaaaaaa, data: { distSol: "Órbita uraniana", size: "1.577 km", atm: "Nenhuma", temp: "-203°C", fact: "Maior lua de Urano, cortada por enormes cânions." } } ],
        data: { distSol: "2,9 B km", size: "50.724 km", atm: "Hidrogênio, Metano", temp: "-197°C", fact: "Gira quase 'deitado' sobre seu próprio eixo." } },
    neptune: { name: "Netuno", type: "Gigante de Gelo", radius: 3.1, dist: 125, speed: 0.0001, color: 0x274687, textureUrl: null, 
        moons: [ { id: 'triton', name: "Tritão", radius: 0.4, dist: 5.5, speed: 0.02, color: 0xbbbbbb, data: { distSol: "Órbita netuniana", size: "2.706 km", atm: "Nitrogênio", temp: "-235°C", fact: "Orbita Netuno no sentido contrário (órbita retrógrada)." } } ],
        data: { distSol: "4,5 B km", size: "49.244 km", atm: "Hidrogênio, Metano", temp: "-201°C", fact: "Possui os ventos mais fortes do Sistema Solar (2.100 km/h)." } }
};

// Variáveis Globais e de Controles
let scene, camera, renderer, controls;
let planetsSystem = [];
let raycasterObjects = [];
let focusedPlanetMesh = null;
let previousTargetPos = new THREE.Vector3();
let targetCamPos = new THREE.Vector3();
let isLerpingCamera = false;

// Estados das Animações
let orbitsActive = true;
let moonsActive = true;
let issActive = true;

const infoPanel = document.getElementById('info-panel');
const container = document.getElementById('canvas-container');

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 70, 140);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxDistance = 800;
    controls.minDistance = 2;

    scene.add(new THREE.AmbientLight(0x333333));
    scene.add(new THREE.PointLight(0xffffff, 2.5, 500));

    // Geração do Universo
    Object.keys(celestialData).forEach((key) => {
        const data = celestialData[key];

        if (key === 'sun') {
            const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 32, 32), new THREE.MeshBasicMaterial({ color: data.color }));
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

        let pMat = data.textureUrl ? new THREE.MeshStandardMaterial({ map: textureLoader.load(data.textureUrl), roughness: 0.8 }) : new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.7 });
        const pMesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 32, 32), pMat);
        pMesh.userData = { id: key, ...data.data, name: data.name, type: data.type, radius: data.radius };
        raycasterObjects.push(pMesh);
        planetGroup.add(pMesh);

        if (data.hasRings) {
            const ringMesh = new THREE.Mesh(new THREE.RingGeometry(data.radius * 1.4, data.radius * 2.3, 64), new THREE.MeshStandardMaterial({ color: 0xbf9b65, side: THREE.DoubleSide, transparent: true, opacity: 0.6 }));
            ringMesh.rotation.x = Math.PI / 2.5;
            planetGroup.add(ringMesh);
        }

        // Sistema Lunar Dinâmico
        let moonsArr = [];
        if (data.moons) {
            data.moons.forEach(moonData => {
                const moonPivot = new THREE.Group();
                const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(moonData.radius, 16, 16), new THREE.MeshStandardMaterial({ color: moonData.color }));
                moonMesh.position.set(moonData.dist + data.radius, 0, 0);

                // Hitbox expansiva para mobile
                const moonHitbox = new THREE.Mesh(new THREE.SphereGeometry(moonData.radius * 2.5, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
                moonHitbox.position.copy(moonMesh.position);
                moonHitbox.userData = { ...moonData.data, name: moonData.name, type: "Satélite Natural", radius: moonData.radius };
                
                moonPivot.add(moonMesh);
                moonPivot.add(moonHitbox);
                raycasterObjects.push(moonHitbox);
                planetGroup.add(moonPivot);
                
                moonsArr.push({ pivot: moonPivot, mesh: moonMesh, speed: moonData.speed });
            });
        }

        let issPivot;
        if (data.hasISS) {
            issPivot = new THREE.Group();
            const core = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8), new THREE.MeshStandardMaterial({ color: 0xcccccc }));
            core.rotation.x = Math.PI / 2;
            const panelMat = new THREE.MeshStandardMaterial({ color: 0x1133aa, side: THREE.DoubleSide });
            const panelGeo = new THREE.BoxGeometry(0.5, 0.02, 0.15);
            const p1 = new THREE.Mesh(panelGeo, panelMat); p1.position.z = 0.15;
            const p2 = new THREE.Mesh(panelGeo, panelMat); p2.position.z = -0.15;
            issPivot.add(core); issPivot.add(p1); issPivot.add(p2);
            issPivot.position.set(data.radius + 0.8, 0, 0);

            const issHitbox = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
            issHitbox.position.copy(issPivot.position);
            issHitbox.userData = { ...issData, radius: 0.3 };
            
            const issRotator = new THREE.Group();
            issRotator.add(issPivot); issRotator.add(issHitbox);
            raycasterObjects.push(issHitbox);
            planetGroup.add(issRotator);
            issPivot = issRotator;
        }

        createOrbitLine(data.dist);
        scene.add(planetGroup);
        planetsSystem.push({ isSun: false, group: planetGroup, pMesh: pMesh, moonsArr: moonsArr, issPivot: issPivot });
    });

    createStarfield();
    window.addEventListener('resize', onWindowResize);
    
    // Tratamento de Cliques (Ignora se o usuário arrastar o dedo)
    let pointerDownPos = new THREE.Vector2();
    renderer.domElement.addEventListener('pointerdown', (e) => pointerDownPos.set(e.clientX, e.clientY));
    renderer.domElement.addEventListener('pointerup', (e) => {
        if (pointerDownPos.distanceTo(new THREE.Vector2(e.clientX, e.clientY)) < 5) onPlanetClick(e);
    });

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
        pos[i] = r * Math.sin(phi) * Math.cos(theta); pos[i+1] = r * Math.sin(phi) * Math.sin(theta); pos[i+2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, transparent: true, opacity: 0.8 })));
}

function onPlanetClick(event) {
    const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(raycasterObjects);

    if (intersects.length > 0) {
        const clickedObj = intersects[0].object;

        // Se clicou no corpo que JÁ ESTÁ focado -> Desfoca (Zoom Out)
        if (focusedPlanetMesh === clickedObj) {
            resetCamera();
            return;
        }

        const info = clickedObj.userData;
        focusedPlanetMesh = clickedObj;
        focusedPlanetMesh.getWorldPosition(previousTargetPos);
        
        const r = info.radius || 2;
        targetCamPos.copy(previousTargetPos).add(new THREE.Vector3(r * 2.5, r * 1.5, r * 3.5));
        isLerpingCamera = true;
        controls.enabled = false; 

        document.getElementById('planet-name').textContent = info.name;
        document.getElementById('planet-type').textContent = info.type;
        document.getElementById('planet-dist').textContent = info.distSol;
        document.getElementById('planet-size').textContent = info.size;
        document.getElementById('planet-atm').textContent = info.atm;
        document.getElementById('planet-temp').textContent = info.temp;
        document.getElementById('planet-fact').textContent = info.fact;
        infoPanel.classList.add('visible');
    }
}

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
            // Rotação própria (Sempre Ativa)
            sys.pMesh.rotation.y += 0.01;

            // Identifica se alguma parte deste sistema (planeta, lua ou iss) está focado
            let isFocusedSystem = false;
            if (focusedPlanetMesh) {
                if (sys.pMesh === focusedPlanetMesh) isFocusedSystem = true;
                if (sys.issPivot && sys.issPivot.children.includes(focusedPlanetMesh)) isFocusedSystem = true;
                if (sys.moonsArr.some(m => m.pivot.children.includes(focusedPlanetMesh))) isFocusedSystem = true;
            }

            // A Translação (Órbita) PAUSA se o planeta estiver focado, OU se as órbitas foram pausadas manualmente
            if (orbitsActive && !isFocusedSystem) {
                sys.group.userData.currentAngle += sys.group.userData.speed;
                sys.group.position.x = Math.cos(sys.group.userData.currentAngle) * sys.group.userData.dist;
                sys.group.position.z = Math.sin(sys.group.userData.currentAngle) * sys.group.userData.dist;
            }

            // Luas
            sys.moonsArr.forEach(moon => {
                moon.mesh.rotation.y += 0.02; // Rotação da lua no próprio eixo
                if (moonsActive) moon.pivot.rotation.y += moon.speed; // Translação da lua
            });

            // ISS
            if (sys.issPivot && issActive) {
                sys.issPivot.rotation.y += 0.05;
                sys.issPivot.rotation.x += 0.01;
            }
        }
    });

    if (focusedPlanetMesh) {
        const currentTargetPos = new THREE.Vector3();
        focusedPlanetMesh.getWorldPosition(currentTargetPos);
        const delta = new THREE.Vector3().subVectors(currentTargetPos, previousTargetPos);

        if (isLerpingCamera) {
            targetCamPos.add(delta); 
            camera.position.lerp(targetCamPos, 0.08);
            controls.target.lerp(currentTargetPos, 0.08);
            if (camera.position.distanceTo(targetCamPos) < 0.5) { isLerpingCamera = false; controls.enabled = true; }
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
    document.getElementById('close-panel').addEventListener('click', () => infoPanel.classList.remove('visible'));
    document.getElementById('btn-reset').addEventListener('click', resetCamera);
    document.getElementById('btn-view').addEventListener('click', () => { resetCamera(); camera.position.set(0, 180, 0.1); });

    // Controles Isolados de Física (Toggles)
    const btnPlanets = document.getElementById('btn-toggle-planets');
    btnPlanets.addEventListener('click', () => { orbitsActive = !orbitsActive; btnPlanets.classList.toggle('active'); btnPlanets.innerText = orbitsActive ? "Planetas: ON" : "Planetas: OFF"; });

    const btnMoons = document.getElementById('btn-toggle-moons');
    btnMoons.addEventListener('click', () => { moonsActive = !moonsActive; btnMoons.classList.toggle('active'); btnMoons.innerText = moonsActive ? "Luas: ON" : "Luas: OFF"; });

    const btnIss = document.getElementById('btn-toggle-iss');
    btnIss.addEventListener('click', () => { issActive = !issActive; btnIss.classList.toggle('active'); btnIss.innerText = issActive ? "ISS: ON" : "ISS: OFF"; });

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
