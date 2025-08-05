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
  const [snake, setSnake] = useState([
    { row: 3, col: 6, direction: "left" },
    { row: 3, col: 7, direction: "left" },
    { row: 3, col: 8, direction: "left" },
  ]);
  const [direction, setDirection] = useState("left");
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

    console.log("snake", snake, "direction", direction);

    let newPos;
    switch (direction) {
      case "right":
        newPos = { row: snake[0].row, col: snake[0].col + 1 };
        if (snake[0].col + 1 >= ColsCount + 1) {
          setMessage("HAI PERSO!!!");
          setPlay(() => false);
        }
        break;
      case "left":
        newPos = { row: snake[0].row, col: snake[0].col - 1 };
        if (snake[0].col - 1 < -1) {
          setMessage("HAI PERSO!!!");
          setPlay(() => false);
        }
        break;
      case "up":
        newPos = { row: snake[0].row - 1, col: snake[0].col };
        if (snake[0].row - 1 < -1) {
          setMessage("HAI PERSO!!!");
          setPlay(() => false);
        }
        break;
      case "down":
        newPos = { row: snake[0].row + 1, col: snake[0].col };
        if (snake[0].row + 1 >= RowsCount + 1) {
          setMessage("HAI PERSO!!!");
          setPlay(() => false);
        }
        break;
    }
    console.log(play);
    snake.unshift({
      row: newPos.row,
      col: newPos.col,
    });
    snake.pop();

    if (
      scacchiera[snake[0].row * RowsCount + snake[0].col]?.isPrize &&
      scacchiera[snake[0].row * RowsCount + snake[0].col].col == snake[0].col &&
      scacchiera[snake[0].row * RowsCount + snake[0].col].row == snake[0].row
    ) {
      console.log("prize won");
      scacchiera[snake[0].row * RowsCount + snake[0].col].isPrize = false;
      scacchiera[
        getRandomIntInclusive(0, ColsCount * RowsCount - 1)
      ].isPrize = true;
      snake.push({
        row: snake[snake.length - 1].row,
        col: snake[snake.length - 1].col,
        direction: snake[snake.length - 1].direction,
      });

      setPrize((prev) => prev + 10);
      setSpeed((prev) => prev - 20);
      setMessage(
        `Il punteggio è: ${prize + 10}. Snake length: ${
          snake.length
        } Speed: ${speed}`
      );
    }

    setSnake(() => snake);

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

    setMessage(
      `Il punteggio è: ${prize}. Snake length: ${snake.length} Speed: ${speed}`
    );
    setTimeout(() => setMove(!move), speed);
  }, []);

  const moveRight = () => {
    setDirection(() => "right");
  };

  const moveLeft = () => {
    setDirection(() => "left");
  };

  const moveUp = () => {
    setDirection(() => "up");
  };

  const moveDown = () => {
    setDirection(() => "down");
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

      if (scacchiera[row * RowsCount + col].isPrize) {
        symbol = (
          <Text p="0" m="0" ta="center" fw={800}>
            🏆
          </Text>
        );
      } else {
        symbol = (
          <Text p="0" m="0" ta="center">
            X
          </Text>
        );
      }

      snake.forEach((el) => {
        //console.log(el);
        if (
          scacchiera[row * RowsCount + col].row == el.row &&
          scacchiera[row * RowsCount + col].col == el.col
        ) {
          symbol = (
            <Text p="0" m="0" ta="center" fw={800}>
              O
            </Text>
          );
        }
      });

      cols.push(
        <TableTd key={row * RowsCount + col}>
          <Text p="0" m="0" ta="center" fw={800}>
            {symbol}
          </Text>
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
          //withTableBorder={true}
          //withRowBorders={true}
          //withColumnBorders={true}
          mx="auto"
          w={ColsCount * 60}
          h={RowsCount * 60}
          style={{ tableLayout: "fixed" }}
        >
          <TableTbody>{rows}</TableTbody>
        </Table>
        <Text>{message}</Text>
      </Stack>
    </Center>
  );
}
