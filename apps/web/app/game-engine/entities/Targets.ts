import { Mesh, SphereGeometry, MeshBasicMaterial } from "three";

export function createTarget(): Mesh {
  const geo = new SphereGeometry(1, 16, 16);
  const mat = new MeshBasicMaterial({ color: "orange" });
  //const mat = new MeshBasicMaterial({ color: "hotpink" });

  const mesh = new Mesh(geo, mat);
  mesh.name = "target";

  return mesh;
}