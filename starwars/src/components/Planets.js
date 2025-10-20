// import React, { useState } from "react";
// import {useQuery, queryKey} from '@tanstack/react-query'
// import Planet from "./Planet";

// // const fetchPlanets = async ({queryKey})=>{
// //     const [key, greeting, page] = queryKey
// //     console.log(greeting, page, key);
// //     const res = await fetch(`https://swapi.dev/api/planets/?page=${page}`)
// //     return res.json()
// // }

// const fetchPlanets = async ({queryKey})=>{
//     const [key, greeting, page] = queryKey
//     console.log(greeting, page, key);
//     const res = await fetch(`https://swapi.dev/api/planets/?page=${page}`)
//     return res.json()
// }

// const Planets = () => {
//     const [page, setPage] = useState(1)
//     const {data, status} = useQuery({
//     queryKey: ['planets', "hello ninjas", page],
//     queryFn: fetchPlanets,
//     staleTime: 5000,
//     // gcTime: 1,
//     // onSuccess: () => {
//     //     console.log('Fetched successfully:');
//     //     return    
//     // },
//     })
//     // console.log(data);
    
//     return (
//         <div>
//             <h1>Planets</h1>    
//             <button onClick={()=> setPage(1)}>Page 1</button>
//             <button onClick={()=> setPage(2)}>Page 2</button>
//             <button onClick={()=> setPage(3)}>Page 3</button>
//             {status ==="error" &&
//             <div>Error in fetching data</div>
//             }

//             {status ==="pending" &&
//             <div>Loading the data ...</div>
//             }

//             {status ==="success" &&
//             <div>{data.results.map(planet=><div key={planet.name}><Planet planet={planet}/></div>)}</div>
//             }
//         </div> 
//     );
// }
 
// export default Planets;



// import { useInfiniteQuery } from '@tanstack/react-query';
// import Planet from "./Planet";

// async function fetchPlanets({ pageParam = 1 }) {
//   const res = await fetch(`https://swapi.dev/api/planets/?page=${pageParam}`);
//   if (!res.ok) throw new Error('Network error');
//   return res.json();
// }

// const InfinitePlanets= ()=> {
//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   } = useInfiniteQuery({
//     queryKey: ['planets'],
//     queryFn: fetchPlanets,
//     getNextPageParam: (lastPage, allPages) => {
//       const nextUrl = lastPage.next; // SWAPI returns "next" URL
//       if (!nextUrl) return undefined;
//       const url = new URL(nextUrl);
//       return url.searchParams.get('page'); // extract next page number
//     },
//   });

//   return (
//     <div>
//       {data?.pages.map((page, i) => (
//         <div key={i}>
//           {page.results.map((planet) => (
//             <p key={planet.name}><Planet planet={planet}></Planet></p>
//           ))}
//         </div>
//       ))}

//       <button
//         onClick={() => fetchNextPage()}
//         disabled={!hasNextPage || isFetchingNextPage}
//       >
//         {isFetchingNextPage ? 'Loading...' : hasNextPage ? 'Load More' : 'No More'}
//       </button>
//     </div>
//   );
// }
// export default InfinitePlanets;



import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Planet from "./Planet";

async function fetchPlanets(page) {
  const response = await fetch(`https://swapi.dev/api/planets/?page=${page}`);
  if (!response.ok) throw new Error('Network error');
  return response.json();
}

function PaginatedPlanets() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['planets', page],
    queryFn: () => fetchPlanets(page),
    keepPreviousData: true, // ✅ Keeps previous page data while loading new page
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading planets</p>;

  return (
    <div>
      {data.results.map((planet) => (
        <p key={planet.name}><Planet planet={planet}></Planet></p>
      ))}

      <div>
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <span> Page {page} </span>
        <button onClick={() => setPage(p => p + 1)} disabled={!data.next}>
          Next
        </button>
      </div>

      {isFetching && <p>Updating...</p>}
    </div>
  );
}
export default PaginatedPlanets;