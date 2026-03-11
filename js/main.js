import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


// Keyboard Animation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const loader = new GLTFLoader();
const url = 'static/SilverMechanicalKeyboard.glb'

loader.load(url, (gltf) => {
    const keyboardGroup = new THREE.Group();

    // Center position to geometry center
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    gltf.scene.position.sub(center); 

    keyboardGroup.add(gltf.scene);

    // Scale relative to window width
    const scale = Math.max(Math.min(window.innerWidth/1000, 1.3), .7);
    keyboardGroup.scale.set(scale, scale, scale);

    // Resize scale when window resizes
    window.addEventListener('resize', () => {
        const scaleFactor = Math.max(Math.min(window.innerWidth/1000, 1.3), .7);
        keyboardGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
    })


    // Continuous rotation on X axis
    gsap.to(keyboardGroup.rotation, {
        x: "+=6.28",      // Full rotation (2π radians)
        duration: 8,       // Seconds per rotation
        ease: "none",      // Constant speed
        repeat: -1         // Forever
    }); 

    // Set model material properties
    gltf.scene.traverse((child) => {
        if (child.isMesh && child.material) {
            child.material.metalness = 0;      // 0-1, higher = more metallic
            child.material.roughness = .3;      // 0-1, lower = shinier
            child.material.color.set('#464e4e'); // Tint the color
            child.material.envMapIntensity = 1.5; // Boost reflections
        }
    });

    // Render model to scene
    scene.add( keyboardGroup ); 
}, undefined, (error) => {
    console.log(error);
});

let navWidth = null;
let navHeight = null;

const renderer = new THREE.WebGLRenderer({ alpha: true});
console.log(window.innerWidth);
if (window.innerWidth >= 1048) {
        navWidth = 250;
        renderer.setSize( window.innerWidth - navWidth, window.innerHeight);
    } else if (window.innerWidth > 767 && window.innerWidth < 1048) {
        renderer.setSize( window.innerWidth, Math.min(window.innerHeight, 1000));
    } else {
        navHeight = 90;
        renderer.setSize( window.innerWidth, Math.min(window.innerHeight - navHeight, 700));
    };


const heroEl = document.getElementById("hero")

if (document.contains(heroEl)) {
    heroEl.appendChild( renderer.domElement );
};

// Camera settings
camera.position.set(0, 0, 500);
camera.rotation.z = Math.PI / 4;


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    if (window.innerWidth >= 1048) {
        navWidth = 250;
        renderer.setSize( window.innerWidth - navWidth, window.innerHeight);
    } else if (window.innerWidth > 767 && window.innerWidth < 1048) {
        renderer.setSize( window.innerWidth, Math.min(window.innerHeight, 1000));
    } else {
        navHeight = 90;
        renderer.setSize( window.innerWidth, Math.min(window.innerHeight - navHeight, 700));
    };
})


// Ambient Light
const ambientLight = new THREE.AmbientLight("#cbb0fa", 1);
scene.add(ambientLight) // Add ambient light to scene

// Directional Lights
const directionalLight = new THREE.DirectionalLight("#089f21", 1);
directionalLight.position.set(5, 2, 5);
scene.add(directionalLight); // Add directional light to scene

const directionalLight2 = new THREE.DirectionalLight("#6728d6", 0.3);
directionalLight2.position.set(5, 15, 2);
scene.add(directionalLight2); // Add directional light to scene

const directionalLight3 = new THREE.DirectionalLight("#0367be", 1);
directionalLight3.position.set(-5, -5, -5);
scene.add(directionalLight3); // Add directional light to scene


// Hemisphere Light
const hemiLight = new THREE.HemisphereLight("#ffffff", "#267bc5", .2);
scene.add(hemiLight);


// Animation

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();



// Animate element when entering viewport
const animatedElements = document.querySelectorAll(".animate-on-scroll");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const child = entry.target.querySelector(".accent-pattern");

        if (entry.isIntersecting) {
            child.classList.add("visible");
        } else {
            child.classList.remove("visible");
        }
    });
}, {threshold: 0.2});

animatedElements.forEach(el => observer.observe(el));



// Mobile navigation toggle
const navToggle = document.getElementById("mobile-navigation-toggle");

navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const mobileNav = document.getElementById("mobile-navigation");
    mobileNav.classList.toggle("open");
});

document.addEventListener("click", (e) => {
    const mobileNav = document.getElementById("mobile-navigation");

    if (!mobileNav.contains(e.target)) {
        mobileNav.classList.remove("open");
    };
});



// Get current date
const today = new Date();
const dateEl = document.getElementById("date");

if (dateEl) {
    dateEl.innerHTML = today.toLocaleDateString();
    console.log("Date added to DOM successfully");
}


