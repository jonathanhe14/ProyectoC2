import {
  Card,
  Image,
  View,
  Heading,
  Flex,
  Badge,
  Text,
  Button,
  useTheme,
  Theme,
  defaultDarkModeOverride,
  ThemeProvider,
} from "@aws-amplify/ui-react";

interface ClasscardProps {
  className: string | null;
  description: string | null;
  level: string | null;
  instructor: string | null;
  time: string | null;
  date: string | null;
}

export const Classcard: React.FC<ClasscardProps> = ({
  className,
  description,
  level,
  instructor,
  time,
  date,
}) => {
  const { tokens } = useTheme();
  const theme: Theme = {
    name: "Auth Example Theme",
    overrides: [defaultDarkModeOverride],
  };
  return (
    <ThemeProvider theme={theme} colorMode="dark">
      <View
        backgroundColor={tokens.colors.background.secondary}
        padding={tokens.space.medium}
      >
        <Card>
          <Flex direction="row" alignItems="flex-start" gap={tokens.space.md}>
            <Flex
              direction="column"
              alignItems="flex-start"
              gap={tokens.space.xs}
            >
              <Flex
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={tokens.space.xs}
              >
                <Flex direction="row" gap={tokens.space.xs}>
                  <Badge size="small" variation="info">
                    {level}
                  </Badge>
                  <Badge size="small" variation="success">
                    {instructor}
                  </Badge>
                </Flex>
                <Flex direction="row" gap={tokens.space.xs}>
                  <Badge size="small" variation="warning">
                    Hora: {time}
                  </Badge>
                  <Badge size="small" variation="warning">
                    Día: {date}
                  </Badge>
                </Flex>
              </Flex>

              <Heading level={5}>{className}</Heading>

              <Text as="span">{description}</Text>

              <Button variation="primary">Reservar</Button>
            </Flex>
          </Flex>
        </Card>
      </View>
    </ThemeProvider>
  );
};
