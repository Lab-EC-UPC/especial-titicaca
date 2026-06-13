
import band0 from "./assets/cover/band-00.webp";
import band1 from "./assets/cover/band-01.webp";
import band2 from "./assets/cover/band-02.webp";
import band3 from "./assets/cover/band-03.webp";
import band4 from "./assets/cover/band-04.webp";
import band5 from "./assets/cover/band-05.webp";
import band6 from "./assets/cover/band-06.webp";
import band7 from "./assets/cover/band-07.webp";

export type CoverBand = {
  src: string;
  width: number;
  height: number;
  placeholder: string;
};

export const COVER_BANDS: CoverBand[] = [
  { src: band0, width: 2048, height: 864, placeholder: "data:image/webp;base64,UklGRnAAAABXRUJQVlA4WAoAAAAQAAAAFwAACQAAQUxQSBgAAAABF3D7/4iIgTDbaJKTPM69jiCi/7kQwxFWUDggMgAAAPACAJ0BKhgACgA/AWqsTqsmJCIwCAFgIAllALToN3eAAP7Ribg+4IXUmyHi8wNfAAAA" },
  { src: band1, width: 2048, height: 864, placeholder: "data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAADwAgCdASoYAAoAPwFqrU8+JiQiMAgDwCAJZQC06C5JAAD+6YA4aGY/Ge4Sx++eLzVeEwK8AAA=" },
  { src: band2, width: 2048, height: 864, placeholder: "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAQBACdASoYAAoAPwFqrU6rJiQiMAgBYCAJZQCsABtmzDI6JqbiHwj7wAD+uUn9Ao/+GEkXQ8Hbo12ua0wg8DHlbA9g9cA8vXulEu6z+xWj3F6vbJQhQYAA" },
  { src: band3, width: 2048, height: 864, placeholder: "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACwAwCdASoYAAoAPwFqrU6rJiQiMAgBYCAJZwAAW9yftEq7sAagAAD+6RO/Xhu/flaHXpuYw9HWL1uBl/JgJGTgTTEAAA==" },
  { src: band4, width: 2048, height: 864, placeholder: "data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADwAgCdASoYAAoAPwForE6rJaQpsAgBYCAJZwDCgDKUAAD+5EqaqQaKiuV3N8TQAAA=" },
  { src: band5, width: 2048, height: 864, placeholder: "data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADwAgCdASoYAAoAPwFqrU8rJaQiMAgBYCAJZwC06C5JAAD+56kvWQ/35XdfMFAAAAA=" },
  { src: band6, width: 2048, height: 864, placeholder: "data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADwAgCdASoYAAoAPwFqrU8rJaQiMAgBYCAJZwC7AC5JAAD+6+qJNW8i3GdeVV4AAAA=" },
  { src: band7, width: 2048, height: 864, placeholder: "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAAAQAwCdASoYAAoAPwFqrE8rJiQiMAgBYCAJZwC06C0Hc4AA/u1VHoZLDLZRxAAA" },
];
