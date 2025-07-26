"use client";
import { Table, TableTr, TableTd, Center } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";

const RowsCount = 20;
const ColsCount = 20;

export default function Home() {
  let data = [];
  let snake = [];
  let row = 0;
  let col = 0;

  useHotkeys([["ArrowLeft", () => console.log("rigth")]], []);

  for (row = 0; row < RowsCount; row++) {
    for (col = 0; col < ColsCount; col++) {
      data.push({
        row,
        col,
        isTurningPoint: false,
        isPrize: false,
        isWall: false,
      });
    }
  }
  data[20].isWall = true;

  snake.push({ row: 3, col: 0 });
  snake.push({ row: 3, col: 1 });
  snake.push({ row: 3, col: 2 });
  snake.push({ row: 3, col: 3 });
  snake.push({ row: 3, col: 4 });

  console.log("data", data, "snake", snake);

  return <Scacchiera data={data} snake={snake} />;
}

export function Scacchiera({ data, snake = [] }) {
  let row;
  let col;
  let rows = [];
  let cols = [];
  for (row = 0; row < RowsCount; row++) {
    cols = [];
    for (col = 0; col < ColsCount; col++) {
      let symbol = "x";

      if (data[row * RowsCount + col].isWall) {
        symbol = "X";
      } else {
        symbol =
          data[row * RowsCount + col].row +
          "," +
          data[row * RowsCount + col].col;
      }
      snake.forEach((el) => {
        if (
          data[row * RowsCount + col].row == el.row &&
          data[row * RowsCount + col].col == el.col
        ) {
          symbol = "O";
        }
      });
      cols.push(<TableTd>{symbol}</TableTd>);
    }
    rows.push(<TableTr>{cols}</TableTr>);
  }

  return (
    <Center mx="auto" v="100vh">
      <Table
        withTableBorder={true}
        withRowBorders={true}
        withColumnBorders={true}
        mx="auto"
        w="300px"
        h="50vh"
      >
        {rows}
      </Table>
    </Center>
  );
}
