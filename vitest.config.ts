import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		workspace: [
			{
				test: {
					name: "test",
					exclude: [
						"**/node_modules/**",
						"**/dist/**",
						"**/.{idea,git,cache,output,temp}/**",
						"**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*"
					],
					globals: true,
					setupFiles: "./vitest.setup.ts"
				}
			}
		]
	}
});
