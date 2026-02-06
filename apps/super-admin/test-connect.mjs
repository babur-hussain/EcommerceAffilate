
console.log("Testing connection to https://api.lfvs.in/health ...");
try {
    const res = await fetch("https://api.lfvs.in/health");
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
} catch (error) {
    console.error("Fetch Error:", error);
}

console.log("\nTesting connection to https://api.lfvs.in/api/super-admin/profile ...");
try {
    const res = await fetch("https://api.lfvs.in/api/super-admin/profile");
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
} catch (error) {
    console.error("Fetch Error:", error);
}
