import React, { useState } from 'react'
import { useStore } from '../../store'
import { SketchFabButton } from './Button'
import data from './data.json'

// https://api.sketchfab.com/v3/search?type=models&q=food&downloadable=true

const loadModelFromServer = (uid) =>
  fetch(`http://localhost:2002/loadModel/${uid}`)

export const ModelPreviewCard = ({
  name,
  uri,
  image,
  username,
  profileUrl,
  onClick,
}) => {
  return (
    <div className="cursor-pointer" onClick={onClick}>
      <img
        className="rounded-lg w-full object-cover"
        src={image.url}
        alt={name}
        height="220"
      />
      <div className="font-bold">{name}</div>
      <div className="flex justify-between">
        <a href={profileUrl} style={{ color: '#2aadef' }}>
          {username}
        </a>
        <a href={uri} style={{ color: '#2aadef' }}>
          SketchFab
        </a>
      </div>
    </div>
  )
}

export const SketchFabSearchList = ({ data, close }) => {
  const addSketchFabModel = useStore((state) => state.addSketchFabModel)

  const onCardClick = (uid) =>
    loadModelFromServer(uid)
      .then((r) => r.json())
      .then((ok) => {
        if (ok) addSketchFabModel(uid)
      })
      .then(close)

  return (
    <div
      className="w-full h-full bg-white flex flex-wrap grid gap-4 p-4"
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      }}
    >
      {data.results.map(
        ({
          name,
          uri,
          uid,
          thumbnails: {
            images: [, , image],
          },
          user: { username, profileUrl },
        }) => {
          const props = { name, uri, image, username, profileUrl }
          return (
            <ModelPreviewCard
              key={uid}
              {...props}
              onClick={() => onCardClick(uid)}
            />
          )
        }
      )}
    </div>
  )
}

export const SketchFabSearch = () => {
  const [showList, setShowList] = useState(false)

  return (
    <>
      {showList ? (
        <div className="fixed top-0 left-0 w-full h-full overflow-y-auto">
          <SketchFabSearchList data={data} close={() => setShowList(false)} />
        </div>
      ) : null}
      <SketchFabButton onClick={() => setShowList(!showList)} />
    </>
  )
}
