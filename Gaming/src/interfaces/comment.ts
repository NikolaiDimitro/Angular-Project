export interface UserComment {
  id: string;            // Уникален идентификатор на коментара
  userId: string;         // ID на потребителя, който е оставил коментара
  content: string;        // Съдържание на коментара
  timestamp: string;      // Дата и час на публикуване на коментара
}

  