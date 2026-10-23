// Builds index.json from the index of venera-app/venera-configs and the
// sources of this fork in index_extra.json.
//
// A source of index_extra.json replaces the upstream one with the same key,
// the others are added after the upstream sources.
//
// Usage: node scripts/merge-index.js <upstream index.json> <index_extra.json> <output>

const fs = require("fs");

const [upstreamPath, extraPath, outputPath] = process.argv.slice(2);
if (!upstreamPath || !extraPath || !outputPath) {
    console.error("Usage: node scripts/merge-index.js <upstream index.json> <index_extra.json> <output>");
    process.exit(1);
}

const upstream = JSON.parse(fs.readFileSync(upstreamPath, "utf8"));
const extra = JSON.parse(fs.readFileSync(extraPath, "utf8"));
if (!Array.isArray(upstream) || !Array.isArray(extra)) {
    console.error("Both indexes must be JSON arrays");
    process.exit(1);
}
for (const source of extra) {
    if (!source.key || !source.fileName || !fs.existsSync(source.fileName)) {
        console.error(`index_extra.json: bad entry ${JSON.stringify(source)}`);
        process.exit(1);
    }
}

const extraKeys = new Set(extra.map((source) => source.key));
const merged = upstream.filter((source) => !extraKeys.has(source.key)).concat(extra);

fs.writeFileSync(outputPath, JSON.stringify(merged, null, 4) + "\n");
console.log(`${upstream.length} upstream + ${extra.length} own sources -> ${merged.length}`);
