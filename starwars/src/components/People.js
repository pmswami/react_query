import React from "react";
import {useQuery} from '@tanstack/react-query'
import Person from "./Person";

const fetchPeople = async ()=>{
    const res = await fetch("https://swapi.dev/api/people")
    return res.json()
}

const People = () => {
    const {data, status} = useQuery({
    queryKey: ['people'],
    queryFn: fetchPeople,
    })
    console.log(data);
    
    return (
        <div>
            <h1>Planets</h1>
            {status ==="error" &&
            <div>Error in fetching data</div>
            }

            {status ==="pending" &&
            <div>Loading the data ...</div>
            }

            {status ==="success" &&
            <div>{data.results.map(person=><div key={person.name}><Person person={person}/></div>)}</div>
            }
        </div> 
    );
}
 
export default People;