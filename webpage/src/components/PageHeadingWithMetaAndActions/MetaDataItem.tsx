import React from 'react';

export interface MetaDataItemProps {
  text: string
  icon: React.ReactNode
}

export const defaultMetaDataIconClass = "mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"


export const MetaDataItem = ({text, icon}:MetaDataItemProps) => {
  return (
    <div className="mt-2 flex items-center text-sm text-gray-500">
      {icon}
      {text}
    </div>
  )
}
