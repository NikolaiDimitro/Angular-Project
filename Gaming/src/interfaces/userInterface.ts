export interface User {
    uid?: string;          // Уникален идентификатор на потребителя
    username: string;      // Име на потребителя
    email: string;         // Имейл на потребителя
    password?: string;     // Парола (опционално, не се съхранява в базата)
  }
  