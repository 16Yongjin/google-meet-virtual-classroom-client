import { getUrl } from '../config'

export const characters = [
  'BaseCharacter.fbx',
  'BlueSoldier_Female.fbx',
  'BlueSoldier_Male.fbx',
  'Casual2_Female.fbx',
  'Casual2_Male.fbx',
  'Casual3_Female.fbx',
  'Casual3_Male.fbx',
  'Casual_Bald.fbx',
  'Casual_Female.fbx',
  'Casual_Male.fbx',
  'Chef_Female.fbx',
  'Chef_Hat.fbx',
  'Chef_Male.fbx',
  'Cow.fbx',
  'Cowboy_Female.fbx',
  'Cowboy_Hair.fbx',
  'Cowboy_Male.fbx',
  'Doctor_Female_Old.fbx',
  'Doctor_Female_Young.fbx',
  'Doctor_Male_Old.fbx',
  'Doctor_Male_Young.fbx',
  'Elf.fbx',
  'Goblin_Female.fbx',
  'Goblin_Male.fbx',
  'Kimono_Female.fbx',
  'Kimono_Male.fbx',
  'Knight_Golden_Female.fbx',
  'Knight_Golden_Male.fbx',
  'Knight_Male.fbx',
  'Ninja_Female.fbx',
  'Ninja_Male.fbx',
  'Ninja_Male_Hair.fbx',
  'Ninja_Sand.fbx',
  'Ninja_Sand_Female.fbx',
  'OldClassy_Female.fbx',
  'OldClassy_Male.fbx',
  'Pirate_Female.fbx',
  'Pirate_Male.fbx',
  'Pug.fbx',
  'Soldier_Female.fbx',
  'Soldier_Male.fbx',
  'Suit_Female.fbx',
  'Suit_Male.fbx',
  'VikingHelmet.fbx',
  'Viking_Female.fbx',
  'Viking_Male.fbx',
  'Witch.fbx',
  'Wizard.fbx',
  'Worker_Female.fbx',
  'Worker_Male.fbx',
  'Zombie_Female.fbx',
  'Zombie_Male.fbx',
]

export const getRandomCharacter = () =>
  getUrl(
    `/assets/people/${
      characters[Math.floor(Math.random() * characters.length)]
    }`
  )

console.log(getRandomCharacter())
console.log(getRandomCharacter())
console.log(getRandomCharacter())
console.log(getRandomCharacter())
console.log(getRandomCharacter())
console.log(getRandomCharacter())
