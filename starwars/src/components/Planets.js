import React, { useState } from "react";
import {useQuery, queryKey} from '@tanstack/react-query'
import Planet from "./Planet";

const fetchPlanets = async ({queryKey})=>{
    const [key, greeting, page] = queryKey
    console.log(greeting, page, key);
    const res = await fetch(`https://swapi.dev/api/planets/?page=${page}`)
    return res.json()
}

const Planets = () => {
    const [page, setPage] = useState(1)
    const {data, status} = useQuery({
    queryKey: ['planets', "hello ninjas", page],
    queryFn: fetchPlanets,
    staleTime: 5000,
    // gcTime: 1,
    // onSuccess: () => {
    //     console.log('Fetched successfully:');
    //     return    
    // },
    })
    // console.log(data);
    
    return (
        <div>
            <h1>Planets</h1>
            <button onClick={()=> setPage(1)}>Page 1</button>
            <button onClick={()=> setPage(2)}>Page 2</button>
            <button onClick={()=> setPage(3)}>Page 3</button>
            {status ==="error" &&
            <div>Error in fetching data</div>
            }

            {status ==="pending" &&
            <div>Loading the data ...</div>
            }

            {status ==="success" &&
            <div>{data.results.map(planet=><div key={planet.name}><Planet planet={planet}/></div>)}</div>
            }
        </div> 
    );
}
 
export default Planets;