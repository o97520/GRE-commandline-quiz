var fs = require('fs'),
    es = require('event-stream'),
    os = require('os');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
PQ = [[]]
L = process.argv[2]
L ||= 100;
console.log('\nsize of batch: ' + L);

(async () => {
    i = 0
    var s = fs.createReadStream('E.txt')
        .pipe(es.split())
        .pipe(es.mapSync(function (line) {
            s.pause();
            if (line !== '') PQ[i].push(line)
            else { PQ.push([]); i++; }
            s.resume();
        }))
    var end = new Promise(function (resolve, reject) {
        s.on('end', () => resolve());
        s.on('error', function (err) { console.log('Error:', err);reject(); })
    });
    await end

    var c1
    var c2
    await rl.question('\nbatch number?  >  ', async function (c) {
        if (isNaN(Number(c))) c = 1
        if (c == '') c = 1
        if (c <= 0) c = 1
        if (c > (Math.floor(PQ.length / L))) c = Math.ceil(PQ.length / L)
        c1 = L * (c - 1)
        c2 = (L * c)
        if (c2 >= PQ.length) c2 = PQ.length - 1
        console.log('\n\n\n\n\n[    batch: ' + c + '    ]  ==>\n\n\n\n\n');
        a = Date.now()
        await waitReadLine()
        b = Date.now()
        console.log('\n\n\n#   --   ', (b-a)/1000 + ' seconds');
        rl.close()
    })

    waitReadLine = async function () {
        while (c2 !== c1 ) {
            cc = new Promise(function (resolve, reject) {
                rl.question('', function (c) {
                    i = Math.floor(Math.random() * (c2 - c1)) + c1
                    console.log("");
                    console.log("-=-=-=-=-=-=-=-=-=-=-=-=" + '[' + (c2 - c1) + ']');
                    console.log("");
                    console.log("");
                    console.log(PQ[i].join('\n'));
                    PQ.splice(i, 1)
                    c2--
                    resolve()
                });
            });
            await cc;
        }
    };

})();
