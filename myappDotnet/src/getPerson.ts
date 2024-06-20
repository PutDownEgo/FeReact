
export type Person = {
    name: string;

}




export function getPerson(): Promise<Person> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ name: 'cuong' });
        }, 3000);
    });
}