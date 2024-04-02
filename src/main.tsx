import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

import './index.css'

import { useWindowVirtualizer } from '@tanstack/react-virtual'

function Example() {
  const listRef = React.useRef<HTMLDivElement | null>(null)
  const [onLoadMoreCalledNTimes, setOnLoadMoreCalledNTimes] = React.useState(0)
  const [nItems, setNItems] = React.useState(1)
  const [isListHidden, setIsListHidden] = React.useState(false)

  const virtualizer = useWindowVirtualizer({
    count: nItems,
    estimateSize: () => 20,
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  })

  const onLoadMore = () => {
    setNItems(n => n + 10)
    setOnLoadMoreCalledNTimes(n => n + 1)
  }

  const virtualItems = virtualizer.getVirtualItems()

  React.useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1]
    if (lastItem && lastItem.index >= nItems - 2) {
      onLoadMore()
    }
  }, [virtualItems])

  return (
    <>
      <div ref={listRef} className="List" style={isListHidden ? { display: 'none' } : undefined}>
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((item) => (
            <div
              key={item.key}
              ref={virtualizer.measureElement}
              data-index={item.index}
              className={item.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${item.size}px`,
                transform: `translateY(${
                  item.start - virtualizer.options.scrollMargin
                }px)`,
              }}
            >
              Row {item.index}
            </div>
          ))}
        </div>
      </div>
      <div className='info-container'>
        <p>Virtual items: {virtualItems.length}</p>
        <p>Items in memory: {nItems}</p>
        <p>onLoadMoreCalled: {onLoadMoreCalledNTimes} times</p>
        <button style={{ marginTop: '1rem' }} onClick={() => setIsListHidden(h => !h)}>{isListHidden ? 'Show' : 'Hide'} list</button>
      </div>
    </>
  )
}

function App() {
  return (
    <div>
      <Example />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
