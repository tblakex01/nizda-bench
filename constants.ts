import { Benchmark, ModelOption } from "./types";

export const BENCHMARK_TASKS: Benchmark[] = [
  {
    id: "floor_plan_3d",
    title: "3D Floor Plan",
    category: "Visual 3D",
    prompt: "Create a floor plan for a 1,585 ft land in 3D.",
    description: "Tests spatial reasoning and 3D library usage.",
  },
  {
    id: "svg_panda",
    title: "SVG Panda",
    category: "Visual 2D",
    prompt: "Generate an SVG of a panda.",
    description: "Tests vector graphics generation.",
  },
  {
    id: "pokeball_3js",
    title: "Three.js Pokeball",
    category: "Visual 3D",
    prompt: "Create a Pokeball in Three.js.",
    description: "Tests complex 3D rendering.",
  },
];

export const MODELS = [
  ModelOption.GEMINI_3_0_PRO,
  ModelOption.DEEPSEEK_V3_2,
  ModelOption.MISTRAL_LARGE_3,
  ModelOption.GPT_4O,
];

// Mock responses for the simulation
export const MOCK_RESPONSES: Record<string, string> = {
  svg_panda: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Face -->
  <circle cx="100" cy="100" r="80" fill="white" stroke="black" stroke-width="4"/>
  <!-- Ears -->
  <circle cx="40" cy="50" r="25" fill="black"/>
  <circle cx="160" cy="50" r="25" fill="black"/>
  <!-- Eyes -->
  <ellipse cx="70" cy="90" rx="15" ry="20" fill="black"/>
  <ellipse cx="130" cy="90" rx="15" ry="20" fill="black"/>
  <circle cx="70" cy="85" r="5" fill="white"/>
  <circle cx="130" cy="85" r="5" fill="white"/>
  <!-- Nose -->
  <ellipse cx="100" cy="110" rx="10" ry="7" fill="black"/>
  <!-- Mouth -->
  <path d="M 85 130 Q 100 140 115 130" stroke="black" stroke-width="3" fill="none"/>
</svg>`,
  floor_plan_3d: `// 3D Floor Plan Generator Code
import * as THREE from 'three';

function generateFloorPlan(scene) {
  // Foundation
  const geometry = new THREE.BoxGeometry(40, 1, 40);
  const material = new THREE.MeshLambertMaterial({ color: 0xcccccc });
  const floor = new THREE.Mesh(geometry, material);
  scene.add(floor);

  // Walls
  const wallMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const wall1 = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 40), wallMat);
  wall1.position.set(-19.5, 5, 0);
  scene.add(wall1);

  console.log("Generated 1,585 sq ft layout...");
}`,
  pokeball_3js: `// Three.js Pokeball Implementation
const sphereGeom = new THREE.SphereGeometry(5, 32, 32);
const materialTop = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const materialBottom = new THREE.MeshStandardMaterial({ color: 0xffffff });
const materialBand = new THREE.MeshBasicMaterial({ color: 0x000000 });

// Upper Hemisphere
// Note: Actual rendering requires setting face colors or multiple meshes
console.log("Rendering Pokeball structure...");
console.log("Applying metallic shaders...");
`,
};
