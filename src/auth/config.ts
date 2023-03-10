import Email from "@auth/core/providers/email";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter";

import type { AstroAuthConfig } from "./server";

const dynamodbClient = DynamoDBDocument.from(new DynamoDB({}), {
    marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
    },
});

export const authConfig: AstroAuthConfig = {
    providers: [
        // Email oesn't work, not sure why.
        Email({
            server: import.meta.env.EMAIL_SERVER,
            from:
                import.meta.env.EMAIL_FROM ??
                "Synthetic Beauty <noreply@synthetic.beauty>",
        }),
    ],
    adapter: DynamoDBAdapter(dynamodbClient, {
        tableName: import.meta.env.AUTH_TABLE_NAME,
    }),
    debug: import.meta.env.DEV,
};
