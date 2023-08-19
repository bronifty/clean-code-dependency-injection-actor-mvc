# Note for Melkey

- use Deno to run the TS files because they use its std lib for fs ops

```bash
deno run -A <filename>.ts
```

// on the cmd line:
deno run myfile.ts equivalent to ts-node myfile.ts

// in a file:
Deno.readTextFile equivalent to fs.readFileSync
Deno.writeTextFile equivalent to fs.writeFileSync
