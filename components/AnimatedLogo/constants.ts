import type {TConfigWord} from "~/components/AnimatedLogo/types";

/*
    this is needed since the spacings between the letters of the font
    differs from the logo (this is a quick attempt to fix that, by no means perfect).
    it defines extra styling per letter.
*/
export const CONFIG: Array<TConfigWord> = [
    [
      {
        content: "A",
        style: {
          letterSpacing: '-12px'
        }
      },
      {content: "V"},
      {content: "R"},
      {content: "O"}
  ],[
    {
      content: "T",
      style: {
          letterSpacing: '0.1rem'
      }
    },
    {content: "R"},
    {content: "O"},
    {content: "S"}
  ]
]