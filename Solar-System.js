 const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 50, 120);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 1, 1000);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const textureLoader = new THREE.TextureLoader();

    // Create Sun
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    textureLoader.load('textures/sun.jpg', 
      (texture) => {
        sunMaterial.map = texture;
        sunMaterial.needsUpdate = true;
      },
      undefined,
      (err) => console.error('An error occurred loading the sun texture:', err)
    );
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Planet data: name, size, color, texture file, orbit radius, orbit speed
    const planetData = [
      { name: "Mercury", size: 2.383, color: 0x8c7c6e, texture: "mercury.jpg", orbit: 10, speed: 0.0015 },
      { name: "Venus", size: 2.949, color: 0xffd700, texture: "venus.jpg", orbit: 17, speed: 0.00075 },
      { name: "Earth", size: 3, color: 0x2233ff, texture: "earth.jpg", orbit: 25, speed: 0.00055 },
      { name: "Mars", size: 4.532, color: 0xff4500, texture: "mars.jpg", orbit: 35, speed: 0.00025 },
      { name: "Jupiter", size: 6.21, color: 0xffa500, texture: "jupiter.jpg", orbit: 50, speed: 0.00015 },
      { name: "Saturn", size: 3.45, color: 0xffd700, texture: "saturn.jpg", orbit: 60, speed: 0.000055 },
      { name: "Uranus", size: 4, color: 0x4fd0e7, texture: "uranus.jpg", orbit: 70, speed: 0.000065 },
      { name: "Neptune", size: 2.88, color: 0x4169e1, texture: "neptune.jpg", orbit: 80, speed: 0.000085 }
    ];

    const planets = [];

    planetData.forEach(data => {
      const geometry = new THREE.SphereGeometry(data.size, 32, 32);
      const material = new THREE.MeshPhongMaterial({ color: data.color });
      textureLoader.load(`textures/${data.texture}`, 
        (texture) => {
          material.map = texture;
          material.needsUpdate = true;
        },
        undefined,
        (err) => console.error(`An error occurred loading the ${data.name} texture:`, err)
      );
      const planet = new THREE.Mesh(geometry, material);
      scene.add(planet);
      planets.push({ mesh: planet, data: data });
    });

    const animate = () => {
      requestAnimationFrame(animate);

      planets.forEach(planet => {
        const { mesh, data } = planet;
        mesh.rotation.y += 0.01;
        mesh.position.x = Math.cos(Date.now() * data.speed) * data.orbit;
        mesh.position.z = Math.sin(Date.now() * data.speed) * data.orbit;
      });

      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });