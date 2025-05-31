export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      chat_history: {
        Row: {
          created_at: string;
          family_id: number | null;
          id: number;
          is_deleted: boolean | null;
          profile_id: string | null;
          status: string | null;
          text: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          family_id?: number | null;
          id?: number;
          is_deleted?: boolean | null;
          profile_id?: string | null;
          status?: string | null;
          text?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          family_id?: number | null;
          id?: number;
          is_deleted?: boolean | null;
          profile_id?: string | null;
          status?: string | null;
          text?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_history_family_id_fkey';
            columns: ['family_id'];
            isOneToOne: false;
            referencedRelation: 'family';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chat_history_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      family: {
        Row: {
          created_at: string;
          id: number;
          image: string | null;
          invitation_token: string | null;
          owner: string | null;
          settings: Json | null;
          title: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          image?: string | null;
          invitation_token?: string | null;
          owner?: string | null;
          settings?: Json | null;
          title?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          image?: string | null;
          invitation_token?: string | null;
          owner?: string | null;
          settings?: Json | null;
          title?: string | null;
        };
        Relationships: [];
      };
      family_members: {
        Row: {
          created_at: string;
          email: string | null;
          family_id: number | null;
          id: number;
          is_owner: boolean | null;
          profile_id: string | null;
          role: string | null;
          status: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          family_id?: number | null;
          id?: number;
          is_owner?: boolean | null;
          profile_id?: string | null;
          role?: string | null;
          status?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          family_id?: number | null;
          id?: number;
          is_owner?: boolean | null;
          profile_id?: string | null;
          role?: string | null;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'family_members_family_id_fkey';
            columns: ['family_id'];
            isOneToOne: false;
            referencedRelation: 'family';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'family_members_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      financial_records: {
        Row: {
          amount: number | null;
          category: string | null;
          created_at: string;
          family_id: number | null;
          id: number;
          note: string | null;
          profile_id: string | null;
        };
        Insert: {
          amount?: number | null;
          category?: string | null;
          created_at?: string;
          family_id?: number | null;
          id?: number;
          note?: string | null;
          profile_id?: string | null;
        };
        Update: {
          amount?: number | null;
          category?: string | null;
          created_at?: string;
          family_id?: number | null;
          id?: number;
          note?: string | null;
          profile_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'financial_records_family_id_fkey';
            columns: ['family_id'];
            isOneToOne: false;
            referencedRelation: 'family';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'financial_records_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      lists: {
        Row: {
          created_at: string;
          family_id: number | null;
          icon: string | null;
          id: number;
          index: number | null;
          title: string | null;
        };
        Insert: {
          created_at?: string;
          family_id?: number | null;
          icon?: string | null;
          id?: number;
          index?: number | null;
          title?: string | null;
        };
        Update: {
          created_at?: string;
          family_id?: number | null;
          icon?: string | null;
          id?: number;
          index?: number | null;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'lists_family_id_fkey';
            columns: ['family_id'];
            isOneToOne: false;
            referencedRelation: 'family';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          email: string | null;
          family_id: number | null;
          full_name: string | null;
          id: string;
          phone: string | null;
          socials: Json | null;
        };
        Insert: {
          avatar_url?: string | null;
          email?: string | null;
          family_id?: number | null;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          socials?: Json | null;
        };
        Update: {
          avatar_url?: string | null;
          email?: string | null;
          family_id?: number | null;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          socials?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_family_id_fkey';
            columns: ['family_id'];
            isOneToOne: false;
            referencedRelation: 'family';
            referencedColumns: ['id'];
          },
        ];
      };
      tasks: {
        Row: {
          assigned_to: string | null;
          created_at: string;
          created_by: string | null;
          deadline: string | null;
          id: number;
          index: number | null;
          is_completed: boolean | null;
          is_urgent: boolean | null;
          list_id: number | null;
          title: string | null;
          updated_at: string | null;
        };
        Insert: {
          assigned_to?: string | null;
          created_at?: string;
          created_by?: string | null;
          deadline?: string | null;
          id?: number;
          index?: number | null;
          is_completed?: boolean | null;
          is_urgent?: boolean | null;
          list_id?: number | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Update: {
          assigned_to?: string | null;
          created_at?: string;
          created_by?: string | null;
          deadline?: string | null;
          id?: number;
          index?: number | null;
          is_completed?: boolean | null;
          is_urgent?: boolean | null;
          list_id?: number | null;
          title?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'tasks_assigned_to_fkey';
            columns: ['assigned_to'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tasks_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tasks_list_id_fkey';
            columns: ['list_id'];
            isOneToOne: false;
            referencedRelation: 'lists';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes'] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
