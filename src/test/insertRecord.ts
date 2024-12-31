import genreService from "../services/genreService";

async function main(){
    genreService.createGenre('Action');
    // genre.createGenre('Action');
    // return genreService;
    // const action = await genreService.createGenre('Action');
const drama = await genreService.createGenre('Drama');
}

main().then(res => {
    console.log(`res`,res);
    
})

// npx ts-node src/test/insertRecord.ts



