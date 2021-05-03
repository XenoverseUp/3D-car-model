import "./style.scss";
import {
  Scene,
  WebGLRenderer,
  AmbientLight,
  DirectionalLight,
  OrthographicCamera,
  Group,
  Mesh,
  BoxBufferGeometry,
  MeshLambertMaterial,
  Vector2,
  CanvasTexture,
} from "three";

const getCarFrontTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 64, 32);

  context.fillStyle = "#666666";
  context.fillRect(8, 8, 48, 24);

  return new CanvasTexture(canvas);
};

const getCarSideTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 128, 32);

  context.fillStyle = "#666666";
  context.fillRect(10, 8, 38, 24);
  context.fillRect(58, 8, 60, 24);

  return new CanvasTexture(canvas);
};

const createCar = () => {
  const car = new Group();

  const backWheel = createWheel();
  backWheel.position.y = 6;
  backWheel.position.x = -18;
  car.add(backWheel);

  const frontWheel = createWheel();
  frontWheel.position.y = 6;
  frontWheel.position.x = 18;
  car.add(frontWheel);

  const main = new Mesh(
    new BoxBufferGeometry(60, 15, 30),
    new MeshLambertMaterial({ color: 0xa52523 })
  );

  main.position.y = 12;
  car.add(main);

  const carFrontTexture = getCarFrontTexture();
  const carBackTexture = getCarFrontTexture();

  const carRightSideTexture = getCarSideTexture();
  const carLeftSideTexture = getCarSideTexture();

  carLeftSideTexture.center = new Vector2(0.5, 0.5);
  carLeftSideTexture.rotation = Math.PI;
  carLeftSideTexture.flipY = false;

  const cabin = new Mesh(new BoxBufferGeometry(33, 12, 24), [
    new MeshLambertMaterial({ map: carFrontTexture }),
    new MeshLambertMaterial({ map: carBackTexture }),
    new MeshLambertMaterial({ color: 0xffffff }),
    new MeshLambertMaterial({ color: 0xffffff }),
    new MeshLambertMaterial({ map: carRightSideTexture }),
    new MeshLambertMaterial({ map: carLeftSideTexture }),
  ]);

  cabin.position.x = -6;
  cabin.position.y = 25.5;
  car.add(cabin);

  return car;
};

const createWheel = () => {
  const geometry = new BoxBufferGeometry(12, 12, 33);
  const material = new MeshLambertMaterial({ color: 0x333333 });
  const wheel = new Mesh(geometry, material);
  return wheel;
};

const scene = new Scene();
const car = createCar();
scene.add(car);

const ambientLight = new AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(200, 500, 300);
scene.add(directionalLight);

const { innerHeight, innerWidth } = window;

const aspectRatio = innerWidth / innerHeight;
const cameraWidth = 150;
const cameraHeight = cameraWidth / aspectRatio;

const camera = new OrthographicCamera(
  cameraWidth / -2,
  cameraWidth / 2,
  cameraHeight / 2,
  cameraHeight / -2,
  0,
  1000
);

camera.position.set(200, 200, 200);
camera.lookAt(0, 10, 0);

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.render(scene, camera);

renderer.setAnimationLoop(() => {
  car.rotation.y -= 0.0007;
  renderer.render(scene, camera);
});

document.body.appendChild(renderer.domElement);
