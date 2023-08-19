# Note for Melkey

- Deno std lib used instead of fs (notes below)

```bash
deno run -A <filename>.ts
```

// on the cmd line:

- deno run myfile.ts equivalent to ts-node myfile.ts

// in a file:

- Deno.readTextFile equivalent to fs.readFileSync
- Deno.writeTextFile equivalent to fs.writeFileSync
