import React,{FC, useState, useEffect} from 'react'
import Board, { moveCard } from "@lourenci/react-kanban";


const board = {
    columns: [
      {
        id: 1,
        title: "Backlog",
        backgroundColor: "#fff",
        cards: [
          {
            id: 1,
            title: "Card title 1",
            description: "Card content"
          },
          {
            id: 2,
            title: "Card title 2",
            description: "Card content"
          },
          {
            id: 3,
            title: "Card title 3",
            description: "Card content"
          }
        ]
      },
      {
        id: 2,
        title: "Doing",
        cards: [
          {
            id: 9,
            title: "Card title 9",
            description: "Card content"
          }
        ]
      },
      {
        id: 3,
        title: "Q&A",
        cards: [
          {
            id: 10,
            title: "Card title 10",
            description: "Card content"
          },
          {
            id: 11,
            title: "Card title 11",
            description: "Card content"
          }
        ]
      },
      {
        id: 4,
        title: "Production",
        cards: [
          {
            id: 12,
            title: "Card title 12",
            description: "Card content"
          },
          {
            id: 13,
            title: "Card title 13",
            description: "Card content"
          }
        ]
      }
    ]
};

const ContactKanban = (props) => {
    const [controlledBoard, setBoard] = useState(board);
    const [boardObj, setBoardObj] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    const newBoard = {
      columns: [
        {
          id: 1,
          title: "Backlosdsdsdsdsdg",
          backgroundColor: "#fff",
          cards: [
            {
              id: 1,
              title: "Card title 1",
              description: "Card content"
            },
            {
              id: 2,
              title: "Card title 2",
              description: "Card content"
            },
            {
              id: 3,
              title: "Card title 3",
              description: "Card content"
            }
          ]
        },
        {
          id: 2,
          title: "Doing",
          cards: [
            {
              id: 9,
              title: "Card title 9",
              description: "Card content"
            }
          ]
        },
        {
          id: 3,
          title: "Q&A",
          cards: [
            {
              id: 10,
              title: "Card title 10",
              description: "Card content"
            },
            {
              id: 11,
              title: "Card title 11",
              description: "Card content"
            }
          ]
        },
        {
          id: 4,
          title: "Production",
          cards: [
            {
              id: 12,
              title: "Card title 12",
              description: "Card content"
            },
            {
              id: 13,
              title: "Card title 13",
              description: "Card content"
            }
          ]
        }
      ]
    };

    const {
        setContactList, contactList
       } = props

    function handleCardMove(_card, source, destination) {
        const updatedBoard = moveCard(controlledBoard, source, destination);
        setBoard(updatedBoard);
    }
    var content = [];

    useEffect(() => {
      var dataArray = [];
      for(let i = 0; i < contactList.length; i++){
        var data = {
            id: i,
            title: "Backlog",
            backgroundColor: "#fff",
            cards: [
              {
                id: 1,
                title: "Card title 1",
                description: "Card content"
              },
              {
                id: 2,
                title: "Card title 2",
                description: "Card content"
              },
              {
                id: 3,
                title: "Card title 3",
                description: "Card content"
              }
            ]
          };
          dataArray.push(data);
    }
    return () => setBoardObj({columns: dataArray});
    }, [boardObj])

    const fetchContent = () => {
        
        for(let i = 0; i < contactList.length; i++){
            var data = {
                id: 1,
                title: "Backlog",
                backgroundColor: "#fff",
                cards: [
                  {
                    id: 1,
                    title: "Card title 1",
                    description: "Card content"
                  },
                  {
                    id: 2,
                    title: "Card title 2",
                    description: "Card content"
                  },
                  {
                    id: 3,
                    title: "Card title 3",
                    description: "Card content"
                  }
                ]
              };
              content.push(data);
        }
        setBoardObj({columns: content})
        // return content;
    }

    useEffect(() => {
        setBoard(newBoard)
        // fetchContent();
        // setTimeout(
        //     function() {
        //         setBoardObj({columns: content});
        //         setTimeout(
        //             function() {
        //                 setBoard(boardObj);
        //             },
        //             2000
        //         );
        //     },
        //     2000
        // );
        // setBoardData(board)
    }, []);

    return (
      <div >
        {/* <Board onCardDragEnd={handleCardMove} disableColumnDrag>
            {boardObj}
        </Board> */}
        <Board onCardDragEnd={handleCardMove} disableColumnDrag>
          {controlledBoard}
      </Board>
      </div>
    )
    // return <Board
    //     allowRemoveLane
    //     allowRenameColumn
    //     allowRemoveCard
    //     onLaneRemove={console.log}
    //     onCardRemove={console.log}
    //     onLaneRename={console.log}
    //     initialBoard={boardData}
    //     allowAddCard={{ on: "top" }}
    //     onNewCardConfirm={(draftCard) => ({
    //     id: new Date().getTime(),
    //     ...draftCard
    //     })}
    //     onCardNew={console.log}
    // />

}

export {ContactKanban}