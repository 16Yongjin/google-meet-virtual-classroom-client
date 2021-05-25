import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CrossIcon,
  IconButton,
  SearchInput,
} from 'evergreen-ui'
import { debounce } from 'lodash'
import { nanoid } from 'nanoid'
import React, { useState } from 'react'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { useStore } from '../../store'
import { SketchfabButton } from './Button'

const fetchModelList = (query) =>
  fetch(
    `https://api.sketchfab.com/v3/search?type=models&q=${query}&downloadable=true`
  ).then((r) => r.json())

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
        style={{ height: '15rem' }}
      />
      <div className="font-bold">{name}</div>
      <div className="flex justify-between">
        <a href={profileUrl} style={{ color: '#2aadef' }}>
          {username}
        </a>
        <a href={uri} style={{ color: '#2aadef' }}>
          Sketchfab
        </a>
      </div>
    </div>
  )
}

export const SketchfabSearchHeader = ({ query, setQuery, close }) => {
  return (
    <div className="w-full h-12 flex items-center">
      <div className="absolute ml-4">
        <IconButton
          onClick={close}
          appearance="minimal"
          icon={CrossIcon}
          iconSize={24}
        />
      </div>
      <div className="w-full flex justify-center">
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sketchfab 모델 검색"
        />
      </div>
    </div>
  )
}

export const SketchfabSearchList = ({ data, close }) => {
  const addSketchfabModel = useStore((state) => state.addSketchfabModel)

  const onCardClick = (uid) =>
    loadModelFromServer(uid)
      .then((r) => r.json())
      .then((ok) => {
        if (ok)
          addSketchfabModel({
            uid,
            uuid: nanoid(),
          })
      })
      .then(close)

  if (!data) {
    return null
  }

  return (
    <div
      className="flex flex-wrap grid gap-4 p-4 overflow-y-auto"
      style={{
        height: 'calc(100% - 6rem)',
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

export const SketchfabSearchPagination = ({ data, setSearchResult }) => {
  const [loading, setLoading] = useState(false)
  const onClick = useCallback(async (url) => {
    setLoading(true)
    const result = await fetch(url).then((r) => r.json())
    setSearchResult(result)
    setLoading(false)
  }, [])

  if (!data) return null

  return (
    <div className="h-8 flex justify-center gap-12 mt-2">
      <IconButton
        icon={ArrowLeftIcon}
        disabled={!data.previous}
        iconSize={24}
        isLoading={loading}
        onClick={() => onClick(data.previous)}
      />
      <IconButton
        icon={ArrowRightIcon}
        disabled={!data.next}
        iconSize={24}
        isLoading={loading}
        onClick={() => onClick(data.next)}
      />
    </div>
  )
}

export const SketchfabSearch = () => {
  const [showList, setShowList] = useState(false)
  const [query, setQuery] = useState('food')
  const [searchResult, setSearchResult] = useState(null)

  const close = useCallback(() => setShowList(false), [])
  const search = useCallback(
    debounce(async (query) => {
      if (query) setSearchResult(await fetchModelList(query))
    }, 1000),
    []
  )
  useEffect(() => {
    search(query)
  }, [search, query])

  return (
    <>
      {showList ? (
        <div
          className="fixed top-0 left-0 w-full h-full overflow-y-auto bg-white"
          style={{ zIndex: '999999999' }}
        >
          <SketchfabSearchHeader
            query={query}
            setQuery={setQuery}
            close={close}
          />
          <SketchfabSearchList data={searchResult} close={close} />
          <SketchfabSearchPagination
            data={searchResult}
            setSearchResult={setSearchResult}
          />
        </div>
      ) : null}
      <SketchfabButton onClick={() => setShowList(!showList)} />
    </>
  )
}
