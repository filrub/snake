"use client";
import {
  Table,
  TableTr,
  TableTd,
  Center,
  TableTbody,
  Text,
  Stack,
} from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { useState, useEffect } from "react";

const RowsCount = 10;
const ColsCount = 10;

export default function Home() {
  const [scacchiera, setScacchiera] = useState([]);
  const [snake, setSnake] = useState([]);
  const [move, setMove] = useState(true);
  const [message, setMessage] = useState(true);
  const [prize, setPrize] = useState(0);
  const [speed, setSpeed] = useState(500);
  const [play, setPlay] = useState(true);

  useHotkeys([
    ["ArrowLeft", () => moveLeft()],
    ["ArrowRight", () => moveRight()],
    ["ArrowUp", () => moveUp()],
    ["ArrowDown", () => moveDown()],
  ]);

  useEffect(() => {
    if (!play) {
      return;
    }
    let direction = null;
    console.log("snake", snake);
    let prizeWon = false;
    let newSnake = snake.map((el) => {
      if (scacchiera[el.row * RowsCount + el.col]?.direction !== null) {
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
        scacchiera[el.row * RowsCount + el.col].isPrize = false;
        scacchiera[
          getRandomIntInclusive(0, ColsCount * RowsCount - 1)
        ].isPrize = true;
        prizeWon = true;
      }

      switch (direction) {
        case "right":
          if (el.col + 1 >= ColsCount) {
            setMessage("HAI PERSO!!!");
            setPlay(false);
          } else {
            return { row: el.row, col: el.col + 1, direction: "right" };
          }
          break;
        case "left":
          if (el.col - 1 < 0) {
            setMessage("HAI PERSO!!!");
            setPlay(false);
          } else {
            return { row: el.row, col: el.col - 1, direction: "left" };
          }
          break;
        case "up":
          if (el.row - 1 < 0) {
            setMessage("HAI PERSO!!!");
            setPlay(false);
          } else {
            return { row: el.row - 1, col: el.col, direction: "up" };
          }
          break;
        case "down":
          if (el.row + 1 >= RowsCount) {
            setMessage("HAI PERSO!!!");
            setPlay(false);
          } else {
            return { row: el.row + 1, col: el.col, direction: "down" };
          }
          break;
      }
    });

    setScacchiera(() => scacchiera);

    if (prizeWon) {
      newSnake.push({
        row: snake[snake.length - 1].row,
        col: snake[snake.length - 1].col,
        direction: snake[snake.length - 1].direction,
      });
      setPrize((prev) => prev + 10);
      setSpeed((prev) => prev - 20);
      setMessage(
        `Il punteggio è: ${prize}. Snake length: ${snake.length} Speed: ${speed}`
      );
    }
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

    data[getRandomIntInclusive(0, ColsCount * RowsCount - 1)].isPrize = true;

    setScacchiera(() => data);

    setSnake(() => [
      { row: 3, col: 6, direction: "left" },
      { row: 3, col: 7, direction: "left" },
      { row: 3, col: 8, direction: "left" },
    ]);
    setMessage(
      `Il punteggio è: ${prize}. Snake length: ${snake.length} Speed: ${speed}`
    );
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

  return (
    <Field
      scacchiera={scacchiera}
      snake={snake}
      message={message}
      play={play}
    />
  );
}

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

export function Field({ scacchiera = [], snake = [], message, play }) {
  //console.log("scacchiera", scacchiera, "snake", snake);
  let row;
  let col;
  let rows = [];
  let cols = [];

  if (scacchiera.length == 0) {
    return;
  }

  if (!play) {
    return (
      <Center h="100vh" w="100vw">
        <Text fw={800}>{message}</Text>
      </Center>
    );
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
            width: "5px",

            padding: 0,
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
      <TableTr style={{ height: "35px" }} key={row * RowsCount + col}>
        {cols}
      </TableTr>
    );
  }

  return (
    <Center mx="auto" v="100vh">
      <Stack>
        <Table
          withTableBorder={true}
          withRowBorders={true}
          withColumnBorders={true}
          mx="auto"
          w={ColsCount * 60}
          h={RowsCount * 40}
        >
          <TableTbody>{rows}</TableTbody>
        </Table>
        <Text>{message}</Text>
      </Stack>
    </Center>
  );
}
