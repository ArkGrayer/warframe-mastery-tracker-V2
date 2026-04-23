export interface UserProfile {
  uid: string;
  nickname: string;
  glyph: string; // URL da imagem do glifo escolhido
  acquired: string[]; // array de uniqueNames
  mastered: string[]; // array de uniqueNames
}
