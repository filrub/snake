"use client";
import { Table, TableTr, TableTd, Center, TableTbody } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { useState, useEffect } from "react";

const RowsCount = 20;
const ColsCount = 20;
const speed = 500;

export default function Home() {
  const [scacchiera, setScacchiera] = useState([]);
  const [snake, setSnake] = useState([]);
  const [move, setMove] = useState(true);

  useHotkeys([
    ["ArrowLeft", () => moveLeft()],
    ["ArrowRight", () => moveRight()],
    ["ArrowUp", () => moveUp()],
    ["ArrowDown", () => moveDown()],
  ]);

  useEffect(() => {
    let direction = null;
    console.log("snake", snake);
    let prizeWon = false;
    let newSnake = snake.map((el) => {
      if (scacchiera[el.row * RowsCount + el.col].direction !== null) {
        direction = scacchiera[el.row * RowsCount + el.col].direction;
      } else {
        direction = el.direction;
      }

      if (
        scacchiera[el.row * RowsCount + el.col].direction !== null &&
        scacchiera[el.row * RowsCount + el.col].col ==
          snake[snake.length - 1].col &&
        scacchiera[el.row * RowsCount + el.col].row ==
          snake[snake.length - 1].row
      ) {
        scacchiera[el.row * RowsCount + el.col].direction = null;
      }

      if (
        scacchiera[el.row * RowsCount + el.col].isPrize &&
        scacchiera[el.row * RowsCount + el.col].col == snake[0].col &&
        scacchiera[el.row * RowsCount + el.col].row == snake[0].row
      ) {
        console.log("prize won");
        prizeWon = true;
      }

      switch (direction) {
        case "right":
          return { row: el.row, col: el.col + 1, direction: "right" };
          break;
        case "left":
          return { row: el.row, col: el.col - 1, direction: "left" };
          break;
        case "up":
          return { row: el.row - 1, col: el.col, direction: "up" };
          break;
        case "down":
          return { row: el.row + 1, col: el.col, direction: "down" };
          break;
      }
    });
    prizeWon &&
      newSnake.push({
        row: snake[snake.length - 1].row,
        col: snake[snake.length - 1].col,
        direction: snake[snake.length - 1].direction,
      });
    setSnake(newSnake);
    setTimeout(() => setMove(!move), speed);
  }, [move]);

  useEffect(() => {
    console.log("firing useeffect");
    let data = [];
    let row = 0;
    let col = 0;
    for (row = 0; row < RowsCount; row++) {
      for (col = 0; col < ColsCount; col++) {
        data.push({
          row,
          col,
          direction: null,
          isPrize: false,
          isWall: false,
        });
      }
    }
    data[31].isPrize = true;

    setScacchiera(() => data);

    setSnake(() => [
      { row: 3, col: 6, direction: "left" },
      { row: 3, col: 7, direction: "left" },
      { row: 3, col: 8, direction: "left" },
      { row: 3, col: 9, direction: "left" },
      { row: 3, col: 10, direction: "left" },
    ]);
    setTimeout(() => setMove(!move), speed);
  }, []);

  const moveRight = () => {
    console.log("moving right");
    scacchiera[snake[0].row * RowsCount + snake[0].col].direction = "right";
    setSnake(() => snake);
  };

  const moveLeft = () => {
    console.log("moving left");
    scacchiera[snake[0].row * RowsCount + snake[0].col].direction = "left";
    setSnake(() => snake);
  };

  const moveUp = () => {
    console.log("moving up");
    scacchiera[snake[0].row * RowsCount + snake[0].col].direction = "up";
    setSnake(() => snake);
  };

  const moveDown = () => {
    console.log("moving down");
    scacchiera[snake[0].row * RowsCount + snake[0].col].direction = "down";
    setSnake(() => snake);
  };

  return <Field scacchiera={scacchiera} snake={snake} />;
}

export function Field({ scacchiera = [], snake = [] }) {
  //console.log("scacchiera", scacchiera, "snake", snake);
  let row;
  let col;
  let rows = [];
  let cols = [];

  if (scacchiera.length == 0) {
    return;
  }

  for (row = 0; row < RowsCount; row++) {
    cols = [];
    for (col = 0; col < ColsCount; col++) {
      let symbol;

      if (scacchiera[row * RowsCount + col].direction !== null) {
        symbol = scacchiera[row * RowsCount + col].direction;
      }

      if (scacchiera[row * RowsCount + col].isPrize) {
        symbol = "P";
      }

      snake.forEach((el) => {
        //console.log(el);
        if (
          scacchiera[row * RowsCount + col].row == el.row &&
          scacchiera[row * RowsCount + col].col == el.col
        ) {
          symbol = "O";
        }
      });
      cols.push(
        <TableTd
          style={{
            width: "10px",
            padding: "auto",
            margin: 0,
            alignItems: "center",
          }}
          key={row * RowsCount + col}
        >
          {symbol}
        </TableTd>
      );
    }
    rows.push(
      <TableTr style={{ height: "50px" }} key={row * RowsCount + col}>
        {cols}
      </TableTr>
    );
  }

  return (
    <Center mx="auto" v="100vh">
      <Table
        withTableBorder={true}
        withRowBorders={true}
        withColumnBorders={true}
        mx="auto"
        w="70vw"
      >
        <TableTbody>{rows}</TableTbody>
      </Table>
    </Center>
  );
}
