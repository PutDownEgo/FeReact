import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Person, getPerson } from './getPerson'


type State = {
    name: string | undefined;
    score: number;
    loading: boolean;
}

type Action = { type: 'initialize', name: string } | { type: 'add' } | { type: 'subtract' } | { type: 'reset' }


const reducer = (state: State, action: Action): State => {

    switch (action.type) {
        case 'initialize':
            return { ...state, name: action.name, loading: false };
        case 'add':
            return { ...state, score: state.score + 1 };
        case 'subtract':
            return { ...state, score: state.score - 1 };
        case 'reset':
            return { ...state, score: 0 };
        default:
            return state;
    }

}




const PersonScore = () => {

    const [person, setPerson] = useState<Person | undefined>();
    // const [score, setScore] = useState(0);
    // const [loading, setLoading] = useState(true);

    const [{ name, score, loading }, dispatch] = React.useReducer(reducer, { name: '', score: 0, loading: true });

    // const sillycal = () => {
    //     let sum = 0;
    //     for (let i = 0; i < 1000000000; i++) {
    //         sum += i;
    //     }
    //     return sum;

    // }

    // const count = useMemo(() => sillycal(), []);

    const addButtonRef = useRef<HTMLButtonElement>(null);


    useEffect(() => {

        const getThePerson = async () => {
            const person = await getPerson();
            if (person) {
                dispatch({ type: 'initialize', name: person.name })
                setPerson(person);
                addButtonRef.current?.focus();

            }

            console.log(person);


        }
        getThePerson();


    }, [])



    const handleAdd = () => {
        dispatch({ type: 'add' })
    }
    const handleSubtract = () => {
        dispatch({ type: 'subtract' })

    }

    // const handleReset = () => {
    //     useCallback(() => dispatch({ type: 'reset' }), [])

    // }

    return (
        <>
            {loading ? (<div>Loading...</div>) : <div>{person?.name} has score {score}</div>}

            <button onClick={handleAdd}>Add</button>
            <button onClick={handleSubtract}>Subtract</button>
            <button >Reset</button>
            <br />
            <br />
            {/* <div>{count}</div> */}
            <button className="d-inline-flex focus-ring py-1 px-2 text-decoration-none border rounded-2" ref={addButtonRef}>button ref ne ba</button>
        </>

    )
}

export default PersonScore