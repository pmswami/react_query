import React from "react";
import {useQuery} from '@tanstack/react-query'
import Planet from "./Planet";

const fetchPlanets = async ()=>{
    const res = await fetch("https://swapi.dev/api/planets")
    return res.json()
}

const Planets = () => {
    const {data, status} = useQuery({
    queryKey: ['planets'],
    queryFn: fetchPlanets,
    staleTime: 5000,
    gcTime: 1,
    // onSuccess: () => {
    //     console.log('Fetched successfully:');
    //     return    
    // },
    })
    // console.log(data);
    
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
            <div>{data.results.map(planet=><div key={planet.name}><Planet planet={planet}/></div>)}</div>
            }
        </div> 
    );
}
 
export default Planets;