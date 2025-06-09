import typos from './common_typos.json';

// Function to check for typos in a given text
export function checkTypos(text: string) : {typo: string, suggestion:string}[]{

    const results: {typo:string, suggestion: string}[] = [];


    const suggestions: string[] = []; // Array to hold suggestions for typos

    // Iterate through each typo in the typos list // in
    for(const typo of Object.keys(typos)){
        if(text.includes(typo)){
            results.push({typo, suggestion:typos[typo as keyof typeof typos]});
        }
    }

    return results;
}


