import { useEffect, useState } from 'react';

//prevents issue with conflicting local storage data from different projects on localhost:3000:
const PREFIX = 'whatsapp-clone-';

export default function useLocalStorage(key, initialValue) {
    const prefixedKey = PREFIX + key;
    //Local storage operations can be slow. Put a fn in useState so it only does it once when the fn is run:
    const [value, setValue] = useState(()=>{
        const jsonValue = localStorage.getItem(prefixedKey);
        if (jsonValue != null && jsonValue !== 'undefined' && jsonValue !== 'null') return JSON.parse(jsonValue);
        if (typeof initialValue === 'function') {
            //then invoke the fn version:
            return initialValue();
        } else {
            //otherwise return the value
            return initialValue;
        }
    })

    useEffect(() => {
        localStorage.setItem(prefixedKey, JSON.stringify(value));
    }, [prefixedKey, value]);

    return [value, setValue];

}
