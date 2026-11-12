import { cn, range } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import AddressCardSkeleton from './address-card-skeleton'
import EmptyAddresses from './empty-addresses'
import { useAddresses } from '@/hooks/use-addresses'
import AddressCard from './address-card'

type Props = {
  onSelect?:(addressId:string)=>void,
  defaultAddressId?:string,
  className?:string,
}

export default function AddressSelector({onSelect,defaultAddressId,className}: Props) {
  const { data:addresses, isLoading:isLoadingAddresses } = useAddresses()
  const [selectedAddress, setSelectedAddress] = useState(
    addresses?.find(address=>address.id === defaultAddressId)?.id
    ??
    addresses?.find(address=>address.isDefault)?.id 
    ?? 
    addresses?.at(0)?.id
  )
  
  useEffect(()=>{
    if(!selectedAddress && !!addresses?.length){
      const defaultAddress = addresses.find(address=>address.id === defaultAddressId)?.id 
        ?? 
        addresses.find(address=>address.isDefault)?.id
        ??
        addresses.at(0)?.id
      onSelect?.(defaultAddress!)
      setSelectedAddress(defaultAddress!)
    } 
  },[addresses,selectedAddress])
  const handleSelect = (newAddressId:string)=>{
    onSelect?.(newAddressId)
    setSelectedAddress(newAddressId)
  }
  return (
    <div className={cn("p-6 grid md:grid-cols-3 gap-3",className)}>
      {
        isLoadingAddresses
        ?
        range(0,5).map(idx=>(
          <AddressCardSkeleton key={idx}/>                
        ))
        :
        !addresses?.length
        ?
        <EmptyAddresses 
          className=' md:col-span-3'
          description="Add a shipping address to proceed with checkout"
        />
        :
        addresses?.map((address) => (
          <div 
            key={address.id}
            className={cn("cursor-pointer rounded-xl",selectedAddress === address.id && "border-primary border-2")}
            onClick={()=>handleSelect(address.id)}
          >
            <AddressCard address={address} key={address.id}/>                
          </div>
        ))
      }
    </div>

  )
}