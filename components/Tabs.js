import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Tabs = ({ activeTab, setActiveTab, tabs, setTabs }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isReorderMode, setIsReorderMode] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;
    const newTabs = Array.from(tabs);
    const [reorderedItem] = newTabs.splice(result.source.index, 1);
    newTabs.splice(result.destination.index, 0, reorderedItem);
    setTabs(newTabs);
  }, [tabs, setTabs]);

  const toggleReorderMode = useCallback(() => {
    setIsReorderMode(prev => !prev);
  }, []);

  const handleTabClick = useCallback((tab) => {
    if (!isReorderMode) {
      setActiveTab(tab);
    }
  }, [isReorderMode, setActiveTab]);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tabs" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                marginBottom: '1rem',
                borderBottom: '1px solid #ccc'
              }}
            >
              {tabs.map((tab, index) => (
                <Draggable key={tab} draggableId={tab} index={index} isDragDisabled={!isReorderMode}>
                  {(provided, snapshot) => (
                    <button
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => handleTabClick(tab)}
                      style={{
                        padding: '1rem',
                        margin: '0.5rem',
                        border: 'none',
                        background: 'none',
                        borderBottom: activeTab === tab ? '2px solid #4CAF50' : 'none',
                        color: activeTab === tab ? '#4CAF50' : '#4a4a4a',
                        fontWeight: activeTab === tab ? 'bold' : 'normal',
                        cursor: isReorderMode ? 'move' : 'pointer',
                        opacity: snapshot.isDragging ? 0.5 : 1,
                        transform: snapshot.isDragging ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.3s ease',
                        flex: '1 1 auto',
                        maxWidth: '200px',
                        userSelect: 'none'
                      }}
                    >
                      {tab}
                    </button>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button
        onClick={toggleReorderMode}
        style={{
          padding: '0.5rem 1rem',
          margin: '0 0 1rem 0',
          backgroundColor: isReorderMode ? '#f44336' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {isReorderMode ? 'Done Reordering' : 'Reorder Tabs'}
      </button>
    </>
  );
};

export default React.memo(Tabs);
