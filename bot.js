const fs = require('fs');
const { Keypair } = require('@solana/web3.js');
const readline = require('readline');

function generateWallets(numWallets) {
    const wallets = [];

    for (let i = 0; i < numWallets; i++) {
        const keypair = Keypair.generate();
        wallets.push({
            publicKey: keypair.publicKey.toString(),
            privateKey: Buffer.from(keypair.secretKey).toString('hex')
        });
    }

    return wallets;
}

function saveWalletsToFile(wallets) {
    const data = wallets.map(wallet => `${wallet.publicKey},${wallet.privateKey}`).join('\n');
    const fileName = getUniqueFilename('solana_wallets.txt');
    fs.writeFileSync(fileName, data);
    console.log(`Wallets saved to ${fileName}`);
    return fileName; // Kembalikan nama file untuk digunakan nanti
}

function getUniqueFilename(baseName) {
    let counter = 1;
    let newName = baseName;

    while (fs.existsSync(newName)) {
        newName = `${baseName.split('.')[0]}_${counter}.${baseName.split('.')[1]}`;
        counter++;
    }

    return newName;
}

function extractPublicKeys(inputFile) {
    const data = fs.readFileSync(inputFile, 'utf-8');
    const publicKeys = data.split('\n').map(line => line.split(',')[0]).filter(Boolean);
    const publicKeysFile = getUniqueFilename('solana_public_keys.txt');
    fs.writeFileSync(publicKeysFile, publicKeys.join('\n'));
    console.log(`Public keys saved to ${publicKeysFile}`);
}

function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Enter the number of wallets to generate: ", (answer) => {
        const numWallets = parseInt(answer, 10);
        if (isNaN(numWallets) || numWallets <= 0) {
            console.log("Please enter a valid positive number.");
            rl.close();
            return;
        }

        const wallets = generateWallets(numWallets);
        const walletsFile = saveWalletsToFile(wallets);
        extractPublicKeys(walletsFile); // Ekstrak kunci publik setelah menyimpan wallet
        rl.close();
    });
}

main();