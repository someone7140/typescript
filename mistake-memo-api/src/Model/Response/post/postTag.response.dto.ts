export class PostTagResponseDto {
  id: string;

  tagWord: string;

  constructor(id: string, tagWord: string) {
    this.id = id;
    this.tagWord = tagWord;
  }
}
