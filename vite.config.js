import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig } from "vite";

export default defineConfig({
    assetsInclude: ["**/*.gltf"],
    base: "/SampleWebAR/",
    publicDir: "static/",
    server: {
        host: true,
    },
    plugins: [basicSsl()],
});
