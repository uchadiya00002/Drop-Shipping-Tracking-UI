export function $prettify(str){
    let new_str = str || ''

    new_str = new_str.replace(/_/g,' ').trim()
    if(new_str){
        new_str = (new_str[0].toUpperCase())+new_str.slice(1)
    }
    
    return new_str
}

export function $prettifyProgressName(str){
    let new_str = str || ''

    new_str = new_str.split(' ');
    if(new_str.length > 0){
        new_str = new_str.map((n,i) => {
            return (n[0].toUpperCase())+n.slice(1) + ' '
        })
    } else {
        new_str = (new_str[0].toUpperCase())+new_str.slice(1)
    }
    
    return new_str
}

export function padZero(num,zeroes=1){
    return (('0'.repeat(zeroes))+num).slice(-1-zeroes)
}



export function listFromDict(dict) {
    return Object.keys(dict).map(k=>{
        if(dict[k]){
            const val = dict[k]
            return {
                ...val,
                name: val.name || $prettify(k||''),
                key: val.key   || k,
            }
        }
    }) 
    
}

export function  clamp(val,min,max) {
    return Math.min(max,Math.max(min,val))
}

export const $windowExists = typeof window !== 'undefined'  

/**
 * This is a function that returns a value within an object's heirarchy.
 * @param {Object} data
 * The object which is to be indexed. 
 * @param {String} key 
 * The key of the value to be extracted.
 * eg: 'user.age'
 * @returns 
 * The value.
 */
 export function getDeepValue(data,key){
    let val = null
    const lineage =  key.split('.')
    lineage.forEach((key_part,i) => {
        if(i == 0){val = data}
        if(val == null){return}
        val = val[key_part]
    });
    return val
}

/**
 * A function that returns a sorting function.
 * @param {String} key
 * Key used to sort the array. 
 * @returns 
 * The function that sorts the array in ascending order.
 */
 export function sortAscending(key,ascending=true){
    const sign = ascending ? 1 : -1
    if(!key){
        return (a,b) => (a>b?1:-1)*sign
    }
    return (a,b) => (a[key]>b[key]?1:-1)*sign
}


export function isAdmin(user){
    return ['SOURCING','SUPERADMIN'].includes(user.role)
}

export function isDeveloper(user){
    return ['DEVELOPER'].includes(user?.role)
}

const months = `jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec`.split(',')
export function $prettyDate(dateString,relative) {
    const date = new Date(dateString)
    const toDate = new Date()
    const dayOfMonth = date.getDate()

    if(relative=='days'){
        const hourDiff = (Date.now() - date.getTime())/1000/3600
        const toDay = toDate.getDate()
        const dayDiff = Math.floor(hourDiff / 24)
        
        if(hourDiff<24 && toDay == dayOfMonth){
            return 'today'
        }
        if(hourDiff < 48 && toDay == dayOfMonth +1){
            return 'yesterday'
        }

        return `${dayDiff} days`

    }

    const dayEnd = dayOfMonth % 10
    const suffix = dayOfMonth == 1 ? 'st' : dayOfMonth == 2 ? 'nd' : dayOfMonth == 3 ? 'rd ' : 'th' 
    const month = months[date.getMonth()]
  
    return `${dayOfMonth}${suffix} ${month.charAt(0).toUpperCase() + month.slice(1)} ${date.getFullYear()}`
    
  }

  export function $prettyTime(dateString) {
    const date = new Date(dateString)
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const min = minutes > 10 ? minutes : '0'+minutes;
    const ampm = hours >= 12 ? 'PM' : 'AM';

    if(hours > 12){
        hours = hours - 12
    }

    const time = (hours >= 10 ? hours : ('0' + hours)) + ':' + min + ' ' + ampm;
    return time;
    
  }

  export function $wait(time){
      return new Promise((res,rej)=>{
          setTimeout(()=>{
            res(time)
          },time)
      })
  }

  export function $date(dateString){
    const date = dateString.split("T")[0]

    const day = date.split("-")[2]
    const month = date.split("-")[1]
    const year = date.split("-")[0]

    const value = `${day}-${month}-${year}`
    return value
  }